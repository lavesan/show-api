import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as moment from 'moment';

import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';
import { SaveOrderForm } from 'src/model/forms/order/SaveOrderForm';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { decodeToken } from 'src/helpers/auth.helpers';
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

@Injectable()
export class OrderToProductService {
    constructor(
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepo: Repository<OrderToProductEntity>,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
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
    async save({ products = [], combos = [], address, contact, ...body }: SaveOrderForm, token: string): Promise<any> {

        if (!products.length && !combos.length) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Pedido sem nenhum produto ou combo.',
            }, HttpStatus.BAD_REQUEST);
        }

        const { receive, ...orderBody } = body;

        const tokenObj = decodeToken(token);

        const data = {
            ...orderBody,
            totalValueCents: '',
            totalProductValueCents: '',
            user: null,
        } as any;

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

        if (address && address.id) {
            addressDB = await this.addressService.findOneById(address.id);
        }

        if (!body.getOnMarket) {


            if (addressDB) {
                totalFreightValue = priceByDistrict[addressDB.district];
                data.totalFreightValuesCents = floatNumberToOnlyNumberString(totalFreightValue);
            }

        }

        const totalValue = totalProductValue + totalFreightValue;

        data.totalValueCents = floatNumberToOnlyNumberString(totalValue);
        data.totalProductValueCents = floatNumberToOnlyNumberString(totalProductValue);

        if (receive) {

            const scheduleIsTaken = await this.orderService.findOneBydateAndTime(receive);
            if (scheduleIsTaken) {
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    message: 'Este horário já está agendado, por favor escolha outro',
                }, HttpStatus.NOT_ACCEPTABLE);
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

            return await this.orderToProductRepo.createQueryBuilder()
                .insert()
                .values(insertValues)
                .execute();

        }

        // Saves the address, if it don't exist
        let addressToSave: any = addressDB;
        if (address && !address.id) {
            addressToSave = await this.addressService.save(address);
        }

        // Saves the contact, if it don't exist
        let contactToSave: any = contact;
        if (contact && contact.id) {
            contactToSave = await this.contactService.findOneById(contact.id);
        } else if (contact && !contact.id) {
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
            products: productsWithQuantity,
            combos: combosWithQuantity,
        };

    }

    async confirmOrder({ id, card }: ConfirmOrderForm) {

        const order = await this.orderService.findById(id);

        if (!order) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                message: 'O seu pedido passou do tempo limite para ser aceito (1 dia). Por favor, faça outro.',
            }, HttpStatus.NOT_FOUND);
        }

        if (OrderType.CREDIT) {
            return await this.getnetService.payCredit({
                card,
                amount: onlyNumberStringToFloatNumber(order.totalValueCents),
                user: order.user,
            })
                .then(res => {
                    order.payed = true;
                    this.orderService.update({ orderId: order.id, orderStatus: OrderStatus.DONE });
                    return res;
                })
                .catch(err => {
                    throw new HttpException({
                        code: HttpStatus.NOT_ACCEPTABLE,
                        message: 'Aconteceu um erro ao finalizar a compra, por favor tente novamente em alguns minutos',
                    }, HttpStatus.NOT_ACCEPTABLE);
                });
        } else if (OrderType.DEBIT) {
            return await this.getnetService.payDebitFirstStep({
                card,
                amount: onlyNumberStringToFloatNumber(order.totalValueCents),
                user: order.user,
            })
                .then(res => {
                    order.payed = false;
                    console.log('resposta débito: ', res);
                    return res;
                })
                .catch(err => {
                    console.log('erro no débito: ', err);
                    throw new HttpException({
                        code: HttpStatus.NOT_ACCEPTABLE,
                        message: 'Aconteceu um erro ao finalizar a compra, por favor tente novamente em alguns minutos',
                    }, HttpStatus.NOT_ACCEPTABLE);
                });
        } else {
            this.orderService.update({ orderId: order.id, orderStatus: OrderStatus.DONE });
        }

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

    private allElemOccurences(arr) {

        const elements = [];
        let prev;

        arr.sort();
        for ( var i = 0; i < arr.length; i++ ) {
            if ( arr[i] !== prev ) {
                elements.push({
                    id: arr[i],
                    frequency: 1,
                });
                // a.push(arr[i]);
                // b.push(1);
            } else {
                elements[elements.length - 1]++;
                // b[b.length-1]++;
            }

            prev = arr[i];
        }

        return elements;

    }

    async findUserStatistic(userId: number) {

        const order = await this.orderService.findAllByUserId(userId);

        // Calculate average Order
        const prices = order.map(ord => {
            return onlyNumberStringToFloatNumber(ord.totalValueCents);
        });
        const totalValueOrders = prices.length ? prices.reduce((previous, next) => previous + next) : 0;
        const averageOrder = prices.length ? totalValueOrders / prices.length : 0;

        // Gets what's the 3 products more bought
        const orderIds = order.map(ord => ord.id);

        const orderToProducts = await this.findByOrderIds(orderIds);

        const products = orderToProducts.map(ordProd => ordProd.product);

        const matrixProductsIds = products.map(pr => pr.id);

        let arrProductsIds = [];
        matrixProductsIds.forEach(arr => arrProductsIds = arrProductsIds.concat(arr));

        const occurences = this.allElemOccurences(arrProductsIds);

        console.log('occurences: ', occurences);
        // let biggers = [];

        // occurences

        return {
            averageOrder,
            boughtFrequency: 'semanal',
            dayOfWeekMostBought: 'segunda',
            mostBoughtsProds: occurences,
        }

    }

    async deleteByOrdersIds(orderIds: number[]) {
        await this.orderService.deleteMany(orderIds);
        return this.orderToProductRepo.delete({ order: { id: In(orderIds) } })
    }

    async deleteInvalidOrders() {

        // 3 - Exclui os produtos da order-to-produc
        // Colects all order to remove
        const ordersWaitingApprovall = await this.orderService.findAllWaitingApproval();

        if (!ordersWaitingApprovall.length) {
            return [];
        }

        const allToRemove = ordersWaitingApprovall.filter(order => {

            const momentDate = moment(order.creationDate);
            const afterOneDay = momentDate.clone().add(1, 'day');

            return momentDate.isSameOrAfter(afterOneDay);

        })

        if (!allToRemove.length) {
            return [];
        }

        const orderIds = allToRemove.map(order => order.id);

        const ordersToProducts = await this.orderToProductRepo.find({ order: { id: In(orderIds) } });

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

                const { quantity } = products.find(pro => pro.id === prod.id);

                // Saves all the products that exceeds the quantity on stock
                if (quantity > product.quantityOnStock) {
                    productsExceedingStock.push(product);
                }

                // Returns error if the quantity is negative
                if (quantity < 0) {
                    throw new HttpException({
                        status: HttpStatus.EXPECTATION_FAILED,
                        message: `A quantidade do produtos ${product.name} está negativa. Valor não aceitável.`,
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
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    message: 'Há produtos que suas quantidades excedem o que temos em estoque.',
                    products: productsExceedingStock,
                }, HttpStatus.NOT_ACCEPTABLE);
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

            })

        }

        return this.productService.debitQuantityOnStock(productsWithQuantity);

    }

}
