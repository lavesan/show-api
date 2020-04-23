import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as moment from 'moment';

import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';
import { SaveOrderForm } from 'src/model/forms/order/SaveOrderForm';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { decodeToken } from 'src/helpers/auth.helpers';
import { unmaskDistrictName } from 'src/helpers/unmask.helpers';
import { UserService } from '../user/user.service';
import { onlyNumberStringToFloatNumber, floatNumberToOnlyNumberString } from 'src/helpers/calc.helpers';
import { GetnetService } from '../getnet/getnet.service';
import { OrderType, OrderStatus } from 'src/model/constants/order.constants';
import { PromotionService } from '../promotion/promotion.service';
import { ConfirmOrderForm } from 'src/model/forms/order/ConfirmOrderForm';
import { ProductComboService } from '../product-combo/product-combo.service';
import { priceByDistrict } from 'src/model/constants/order.constants';
import { ProductInfoForm } from 'src/model/forms/product/ProductInfoForm';
import { ComboInfoForm } from 'src/model/forms/combo/ComboInfoForm';
import { AddressService } from '../address/address.service';
import { ContactService } from '../contact/contact.service';
import { decodeGenericData } from 'src/helpers/auth.helpers';

@Injectable()
export class OrderToProductService {
    constructor(
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepo: Repository<OrderToProductEntity>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly getnetService: GetnetService,
        private readonly promotionService: PromotionService,
        private readonly comboService: ProductComboService,
        private readonly addressService: AddressService,
        private readonly contactService: ContactService,
    ) {}

    /**
     * @description Saves a new order
     * @param {SaveOrderForm} param0
     * @param {string} token If there's a token, use this to save the user
     */
    async save({
            products = [],
            combos = [],
            address,
            contact,
            saveAddress,
            userName = '',
            description,
            ...body
        }: SaveOrderForm,
        token: string
    ): Promise<any> {

        if (!products.length && !combos.length) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Pedido sem nenhum produto ou combo.',
            }, HttpStatus.BAD_REQUEST);
        }

        const { receive, id, ...orderBody } = body;

        const tokenObj = decodeToken(token);

        const data = {
            ...orderBody,
            totalValueCents: '',
            totalProductValueCents: '',
            user: null,
            payed: false,
            description,
            userName,
        } as any;

        // Deletes the unconfirmed order from the user
        if (id) {
            await this.deleteInvalidOrders(id);
        }

        // If the token exists, the user is vinculated with the order
        if (tokenObj) {
            const user = await this.userService.findById(tokenObj.id);
            data.user = user;
        }

        // 1 - Finds all the promotions from the user
        const productsWithQuantity = await this.getProductsToSave(products, token);

        // 3 - Gets all the values from combos
        const combosWithQuantity = await this.getCombosToSave(combos);

        // 4 - Sum everything (promotions, products, freight and combos)
        let totalProductValue = 0;

        // Sums the combos values, if there's combos
        if (combosWithQuantity.length) {
            combosWithQuantity.forEach(comboWithQuantity => {
                totalProductValue += onlyNumberStringToFloatNumber(comboWithQuantity.totalValue) * comboWithQuantity.quantity;
            })
        }

        // Sums the products value, if there's products
        if (productsWithQuantity.length) {
            for (const { actualValueCents, quantity, promotionalValueCents } of productsWithQuantity) {
                if (promotionalValueCents) {
                    totalProductValue += onlyNumberStringToFloatNumber(promotionalValueCents) * quantity;
                } else {
                    totalProductValue += onlyNumberStringToFloatNumber(actualValueCents) * quantity;
                }
            }
        }

        // Sums the freight value
        let totalFreightValue = 0;

        let addressDB = address;

        // Search for the address on the database, to update
        if (address && address.id) {
            addressDB = await this.addressService.findOneById(address.id);
        }

        // Adds freight value to total order value
        if (addressDB) {

            const formatedDistrict = unmaskDistrictName(addressDB.district);

            totalFreightValue = priceByDistrict[formatedDistrict];

            if (!totalFreightValue) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Não entregamos nesta localidade',
                }, HttpStatus.BAD_REQUEST)
            }

            data.totalFreightValuesCents = floatNumberToOnlyNumberString(totalFreightValue);
        }

        const totalValue = totalProductValue + totalFreightValue;

        data.totalValueCents = floatNumberToOnlyNumberString(totalValue);
        data.totalProductValueCents = floatNumberToOnlyNumberString(totalProductValue);

        if (receive) {

            const scheduleIsTaken = await this.orderService.findOneBydateAndTime(receive)
                .catch(err => {

                    const receiveFormatted = {
                        ...receive,
                        date: moment(receive.date, 'DD/MM/YYYY').format('MM/DD/YYYY'),
                    }

                    return this.orderService.findOneBydateAndTime(receiveFormatted);

                });

            if (scheduleIsTaken) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Este horário já está agendado, por favor escolha outro',
                }, HttpStatus.BAD_REQUEST);
            }

            const fullDate = moment(`${receive.date} ${receive.time}`, 'DD/MM/YYYY HH:mm');

            data.receiveDate = fullDate.toDate();
            data.receiveTime = fullDate.toDate();

        }

        // Decreases the quantity on stock of the products and products from combos
        await this.subtractStockQuantity(combosWithQuantity, productsWithQuantity);

        // Saves the order
        const order = await this.orderService.save(data);

        if (order) {

            const insertValues = [];

            for (const { quantity, ...productDB } of productsWithQuantity) {
                insertValues.push({
                    quantity,
                    product: productDB,
                    order,
                });
            }

            await this.orderToProductRepo.createQueryBuilder()
                .insert()
                .values(insertValues)
                .execute();

        }

        // Saves the address, if it don't exist
        let addressToSave: any = addressDB;
        if (address && !address.id) {

            const addressData: any = address;

            delete addressData.id;

            if (data.user && saveAddress) {
                addressData.userId = data.user.id;
            }

            addressData.type = 'Endereço';

            addressToSave = await this.addressService.save(addressData);

        }

        // Saves the contact, if it don't exist
        let contactToSave: any = contact;
        if (contact && contact.id) {
            contactToSave = await this.contactService.findOneById(contact.id);
        } else if (contact && !contact.id) {

            delete contact.id;

            contactToSave = await this.contactService.save(contact);

        }

        let finalOrder: any = order;
        // Saves the contact and address to the order
        if (addressToSave || contactToSave) {

            const dataToSave = {} as any;
            if (addressToSave) {
                dataToSave.address = addressToSave;
            }
            if (contactToSave) {
                dataToSave.contact = contactToSave;
            }

            finalOrder = await this.orderService.updateOrder({
                id: order.id,
                ...dataToSave,
            });
        }

        return {
            order,
            address: addressDB,
            products: productsWithQuantity,
            combos: combosWithQuantity,
        };

    }

    async confirmOrder({ id, card, saveCard }: ConfirmOrderForm) {

        const order = await this.orderService.findById(id);

        if (!order) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                message: 'O seu pedido passou do tempo limite para ser aceito (1 hora). Por favor, faça outro.',
            }, HttpStatus.NOT_FOUND);
        }

        if (order.type === OrderType.CREDIT && card) {

            const decodedCard = decodeGenericData(card);

            delete decodedCard.iat;

            return await this.getnetService.payCredit({
                card: decodedCard,
                amount: onlyNumberStringToFloatNumber(order.totalValueCents),
                user: order.user,
                saveCard,
                order,
            })
                .then(res => {
                    order.payed = true;
                    this.orderService.update({
                        orderId: order.id,
                        orderStatus: OrderStatus.MADE,
                        getnetPaymentId: res.payment_id,
                        cardCode: res.order_id,
                    });
                    return res;
                });
        } else {

            this.orderService.update({ orderId: order.id, orderStatus: OrderStatus.MADE });

            return {
                ...order,
                status: OrderStatus.MADE,
            };

        }
        // else if (order.type === OrderType.DEBIT) {
        //     return await this.getnetService.payDebitFirstStep({
        //         card,
        //         amount: onlyNumberStringToFloatNumber(order.totalValueCents),
        //         user: order.user,
        //     })
        //         .then(res => {
        //             order.payed = false;
        //             console.log('resposta débito: ', res);
        //             return res;
        //         })
        //         .catch(err => {
        //             console.log('erro no débito: ', err);
        //             throw new HttpException({
        //                 code: HttpStatus.NOT_ACCEPTABLE,
        //                 message: 'Aconteceu um erro ao finalizar a compra, por favor tente novamente em alguns minutos',
        //             }, HttpStatus.NOT_ACCEPTABLE);
        //         });
        // }

    }

    async finalizeDebitPayment(body: any) {

        console.log('body: ', body);
        // return this.getnetService.finishDebitPayment(body)
        //     .catch(err => {
        //         console.log('deu pau vei: ', err);
        //     });

        // await this.orderService.update({ orderStatus: OrderStatus.MADE, orderId: 1 });

    }

    async findAllProductFromOrder(orderId: number) {
        const result = await this.orderToProductRepo.find({
            where: { order: { id: orderId } }
        });

        if (result) {
            const data = result.map(ordToProd => ({
                quantity: ordToProd.quantity,
                product: {
                    id: ordToProd.product.id,
                    name: ordToProd.product.name,
                },
            }));
        }
    }

    async checkDebit(id: number) {
        return this.orderService.checkDebitOrder(id);
    }

    findByOrderIds(orderIds: number[]) {
        return this.orderToProductRepo.find({ order: { id: In(orderIds) } });
    }

    private findAllOccurences(orderToProdArr: OrderToProductEntity[]) {

        const finalArr = [];
        orderToProdArr.forEach(orderToProd => {

            const haveProduct = Boolean(orderToProd.product);

            if (!finalArr.some(e => {
                return haveProduct
                    ? e.product.id === orderToProd.product.id
                    : e.product.id === orderToProd.combo.id;
            })) {
                const allOccurences = orderToProdArr.filter(e => e.id === orderToProd.id);
                finalArr.push(
                    {
                        quantity: allOccurences.length,
                        product: haveProduct
                            ? orderToProd.product
                            : orderToProd.combo,
                    }
                );
            }
        });

        return finalArr;
    }

    private findTopMostSeller = (orderToProducts: OrderToProductEntity[], topNumber: number) => {

        let occurrences = this.findAllOccurences(orderToProducts);

        const topThree = [];

        for (let i = 0; i < topNumber; i++) {

            let lastElem: any = {
                occurence: {
                    quantity: 0,
                },
            };

            occurrences.forEach((occurence, index) => {

                if (lastElem.occurence.quantity < occurence.quantity) {
                    lastElem = {
                        occurence,
                        index,
                    };
                }

            });

            if (!lastElem.hasOwnProperty('index')) {
                break;
            }

            occurrences = [
                ...occurrences.slice(0, lastElem.index),
                ...occurrences.slice(lastElem.index + 1, occurrences.length - 1),
            ];

            topThree.push(lastElem.occurence);
        }

        return topThree;

    }

    async findUserStatistic(userId: number) {

        const order = await this.orderService.findAllByUserId(userId);

        // Calculate average Order
        const prices = order.map(ord => {
            return onlyNumberStringToFloatNumber(ord.totalValueCents);
        });
        const totalValueOrders = prices.length ? prices.reduce((previous, next) => previous + next) : 0;
        const averageOrder = prices.length ? Number((totalValueOrders / prices.length).toFixed(2)) : 0;

        // Gets what's the 3 products more bought
        let occurences = [];
        if (order.length) {
            const orderIds = order.map(ord => ord.id);
            const orderToProducts = await this.findByOrderIds(orderIds);
            occurences = this.findTopMostSeller(orderToProducts, 3);
        }

        return {
            averageOrder,
            boughtFrequency: 'semanal',
            dayOfWeekMostBought: 'segunda',
            mostBoughtsProds: occurences,
        };

    }

    async deleteByOrdersIds(orderIds: number[]) {

        await this.orderToProductRepo.delete({ order: { id: In(orderIds) } })
        return this.orderService.deleteMany(orderIds);

    }

    async deleteInvalidOrders(orderId?: number) {

        let ordersWaitingApprovall = [];

        if (orderId) {
            ordersWaitingApprovall = [(await this.orderService.findById(orderId))];
            if (!ordersWaitingApprovall[0]) {
                return [];
            }
        }

        if (!ordersWaitingApprovall.length) {
            // 3 - Exclui os produtos da order-to-produc
            // Colects all order to remove
            ordersWaitingApprovall = await this.orderService.findAllWaitingApproval();
        }

        if (!ordersWaitingApprovall.length) {
            return [];
        }

        let allToRemove = [];

        if (orderId) {
            allToRemove = ordersWaitingApprovall;
        } else {

            allToRemove = ordersWaitingApprovall.filter(order => {

                const momentDate = moment(order.creationDate);
                const afterOneDay = momentDate.clone().add(1, 'hours');
                const today = moment();

                return today.isSameOrAfter(afterOneDay);

            });

        }


        if (!allToRemove.length) {
            return [];
        }

        const orderIds = allToRemove.map(order => order.id);

        const ordersToProducts = await this.orderToProductRepo.createQueryBuilder('orp')
            .where('orp_ord_id IN (:...value)', { value: orderIds })
            .leftJoinAndSelect('orp.product', 'product')
            .leftJoinAndSelect('orp.combo', 'combo')
            .getMany();

        const combosToRefund = [];

        let productsToRefund = ordersToProducts.map(orderToProd => {

            const data = {
                quantity: orderToProd.quantity,
            } as any;

            if (orderToProd.product) {
                data.id = orderToProd.product.id;
            } else if (orderToProd.combo) {
                combosToRefund.push(orderToProd.combo.id);
                data.combo = orderToProd.combo;
            }

            return data;

        });

        if (combosToRefund.length) {

            const productsFromCombos = await this.comboService.findAllProductsFromCombos(combosToRefund);

            const addOnRefund = [];

            productsFromCombos.forEach(prodCombo => {

                const refundProd = productsToRefund.find(refund => refund && refund.combo);

                if (refundProd) {
                    addOnRefund.push({
                        id: prodCombo.product.id,
                        quantity: refundProd.quantity * prodCombo.quantity,
                    })
                }
            })

            productsToRefund = productsToRefund.concat(addOnRefund);

        }

        productsToRefund = productsToRefund.filter(f => f.id);

        // 1 - Refund quantities on stock
        await this.productService.addQuantitiesOnStock(productsToRefund);

        // 2 - Delete todos os dados do pedido
        await this.deleteByOrdersIds(orderIds);

        return {
            ordersWaitingApprovall,
            productsToRefund,
            combosToRefund,
        }

    }

    /**
     * @description Gets the data needed to calculate the products values
     * @param {ProductInfoForm[]} products 
     * @param {string} token 
     */
    private async getProductsToSave(products: ProductInfoForm[] = [], token: string): Promise<any[]> {

        let productsWithQuantity = [];

        if (products && products.length) {

            const promProductsBestPrices = await this.promotionService.findPromotionBestPricesFromUser(token);

            const productsExceedingStock = [];

            // 2 - Finds all products and sum to get the total order value
            const productsIds = products.map(product => product.id);
            const productsDB = await this.productService.findManyByIds(productsIds);

            productsWithQuantity = productsDB.map(product => {

                delete product.imgUrl;

                const { quantity } = products.find(pro => pro.id === product.id);

                // Saves all the products that exceeds the quantity on stock
                if (quantity > product.quantityOnStock) {
                    productsExceedingStock.push(product);
                }

                // Returns error if the quantity is negative
                if (quantity < 0) {
                    throw new HttpException({
                        status: HttpStatus.EXPECTATION_FAILED,
                        message: `A quantidade do produto ${product.name} está negativa. Valor não aceitável.`,
                    }, HttpStatus.EXPECTATION_FAILED);
                }

                const prod = product as any;

                const promoProduct = promProductsBestPrices.find(pro => pro.productId === product.id);

                if (promoProduct) {
                    prod.promotionalValueCents = promoProduct.valueCents;
                    prod.promotionId = promoProduct.promotionId;
                }

                return {
                    ...prod,
                    quantity,
                };
            });

            // If there's products in the order exceeding the quantity on stock, returns a error with the products
            if (productsExceedingStock.length) {

                const exceedProductsNames = productsExceedingStock.map(prod => prod.name);

                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    message: `Os produtos ${exceedProductsNames.join(', ')} excedem o que temos em estoque.`,
                    products: productsExceedingStock,
                }, HttpStatus.BAD_REQUEST);
            }

        }

        return productsWithQuantity;

    }

    /**
     * @description Gets the data needed to calculate the combos values
     * @param {ComboInfoForm[]} combos
     */
    private async getCombosToSave(combos: ComboInfoForm[] = []): Promise<any[]> {

        let combosWithQuantity = [];

        if (combos && combos.length) {

            const combosIds = combos.map(combo => combo.id);

            const combosDB = await this.comboService.findAllComboProducts(combosIds);

            combosWithQuantity = combos.map(combo => {

                let comboData = combo;

                const comboDB = combosDB.find(combDB => combDB.id === combo.id);
                if (comboDB) {
                    comboData = {
                        ...comboData,
                        ...comboDB,
                    }
                }

                return comboData;

            })

        }

        return combosWithQuantity;

    }

    /**
     * @description Subtract the quantity of the products on stock
     * @param {any[]} combosWithQuantity
     * @param {any[]} productsWithQuantity
     */
    private subtractStockQuantity(combosWithQuantity = [], productsWithQuantity = []) {

        let productsFromCombosToDebit = [];

        if (combosWithQuantity.length) {

            combosWithQuantity.forEach(combowithQuantity => {

                if (combowithQuantity.products && combowithQuantity.products.length) {

                    const comboToAdd = combowithQuantity.products.map(product => {

                        const finalQuantity = product.quantity + combowithQuantity.quantity;

                        return {
                            id: product.product.id,
                            quantity: finalQuantity,
                        }

                    })

                    productsFromCombosToDebit = productsFromCombosToDebit.concat(comboToAdd);

                }

            });

        }

        return this.productService.debitQuantityOnStock(productsWithQuantity);

    }

    findOneData(orderId: number) {
        return this.orderToProductRepo.createQueryBuilder('ordToProd')
            .leftJoinAndSelect('ordToProd.product', 'product')
            .leftJoinAndSelect('ordToProd.combo', 'combo')
            .where('orp_ord_id = :orderId', { orderId })
            .getMany();
    }

    async findAllActiveOrdersByIds(orderIds: number[]) {

        const orders = [];

        for (const orderId of orderIds) {

            const order = await this.orderService.findById(orderId);

            if (!order || order.status === OrderStatus.TO_FINISH) {
                break;
            }

            let showOrder = Boolean(order);

            if ((OrderStatus.SENDED === order.status || OrderStatus.CANCELED === order.status)) {

                const momentReceiveDate = moment(order.receiveDate).add(2, 'days');
                const today = moment();
                showOrder = momentReceiveDate.isAfter(today);

            }

            if (showOrder) {

                const allOrderToProd = await this.findOneData(order.id);

                orders.push({
                    ...order,
                    products: allOrderToProd.filter(ordToProd => ordToProd.product),
                    combos: allOrderToProd.filter(ordToProd => ordToProd.combo),
                });

            }

        }

        return orders;

    }

}
