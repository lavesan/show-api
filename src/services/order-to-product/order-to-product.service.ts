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
    ) {}

    /**
     * @description Saves a new order
     * @param {SaveOrderForm} param0
     * @param {string} token If there's a token, use this to save the user
     */
    async save({ products, ...body }: SaveOrderForm, token: string): Promise<any> {

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

        // Finds all the promotions from the user
        const promProductsBestPrices = await this.promotionService.findPromotionBestPricesFromUser(token);

        const productsExceedingStock = [];

        // Finds all products and sum to get the total order value
        const productsIds = products.map(product => product.id);
        const productsDB = await this.productService.findManyByIds(productsIds);
        const productsWithQuantity = productsDB.map(product => {

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
                message: 'Há produtos que excedem nossa atual quantidade no estoque.',
                products: productsExceedingStock,
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        let totalProductValue = 0;

        for (const { actualValueCents, quantity, promotionalValueCents } of productsWithQuantity) {
            if (promotionalValueCents) {
                totalProductValue += onlyNumberStringToFloatNumber(promotionalValueCents) * quantity;
            } else {
                totalProductValue += onlyNumberStringToFloatNumber(actualValueCents) * quantity;
            }
        }

        const totalValue = totalProductValue + onlyNumberStringToFloatNumber(data.totalFreightValuesCents);

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

        await this.productService.debitQuantityOnStock(productsWithQuantity);

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

        return {
            products: productsWithQuantity,
            order,
        };

    }

    async confirmOrder({ id, card }: ConfirmOrderForm) {

        const order = await this.orderService.findById(id);

        if (!order) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                message: 'Você pode confirmar um pedido até no máximo 1 dia, passado este tempo você tem de fazer outro.',
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
        const [result, count] = await this.orderToProductRepo.findAndCount({
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

}
