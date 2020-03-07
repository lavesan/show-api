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
import { SaveScheduledTimeForm } from 'src/model/forms/scheduled-time/SaveScheduledTimeForm';
import { GetnetService } from '../getnet/getnet.service';
import { OrderType, OrderStatus } from 'src/model/constants/order.constants';

@Injectable()
export class OrderToProductService {
    constructor(
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepo: Repository<OrderToProductEntity>,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
        private readonly getnetService: GetnetService,
    ) {}

    /**
     * @description Saves a new order
     * @param {SaveOrderForm} param0
     * @param {string} token If there's a token, use this to save the user
     */
    async save({ products, card, ...body }: SaveOrderForm, token: string): Promise<any> {

        const { receive, ...orderBody } = body;

        const tokenObj = decodeToken(token);

        const data: any = {
            ...orderBody,
            totalValueCents: 0,
            totalProductValueCents: 0,
            user: null,
        };

        // If the token exists, the user is vinculated with the order
        if (tokenObj) {
            const user = await this.userService.findById(tokenObj.id);
            data.user = user;
        }

        const productsIds = products.map(product => product.id);
        const productsDB = await this.productService.findManyByIds(productsIds);
        const productsWithQuantity = productsDB.map(product => {

            const { quantity } = products.find(prod => prod.id === product.id);

            return {
                ...product,
                quantity,
            };
        });

        for (const { actualValueCents, quantity } of productsWithQuantity) {
            data.totalProductValueCents += onlyNumberStringToFloatNumber(actualValueCents) * quantity;
        }

        data.totalValueCents = data.totalProductValueCents + onlyNumberStringToFloatNumber(data.totalFreightValuesCents);

        data.totalValueCents = floatNumberToOnlyNumberString(data.totalValueCents);
        data.totalProductValueCents = floatNumberToOnlyNumberString(data.totalProductValueCents);

        if (receive) {

            const scheduleIsTaken = await this.orderService.findOneBydateAndTime(receive);
            if (scheduleIsTaken) {
                throw new HttpException({
                    code: HttpStatus.NOT_ACCEPTABLE,
                    message: 'Este horário já está agendado, por favor escolha outro',
                }, HttpStatus.NOT_ACCEPTABLE);
            }

            const fullDate = moment(`${receive.date} ${receive.time}`, 'DD/MM/YYYY HH:mm');

            data.receiveDate = fullDate.toDate();
            data.receiveTime = fullDate.toDate();

        }

        if (OrderType.CREDIT) {
            await this.getnetService.payCredit({
                card,
                amount: onlyNumberStringToFloatNumber(data.totalValueCents),
                user: data.user,
            })
                .then(res => {
                    data.payed = true;
                    console.log('resposta crédito: ', res);
                })
                .catch(err => {
                    console.log('erro no crédito: ', err);
                    throw new HttpException({
                        code: HttpStatus.NOT_ACCEPTABLE,
                        message: 'Aconteceu um erro ao finalizar a compra, por favor tente novamente em alguns minutos',
                    }, HttpStatus.NOT_ACCEPTABLE);
                });
        } else if (OrderType.DEBIT) {
            await this.getnetService.payDebitFirstStep({
                card,
                amount: onlyNumberStringToFloatNumber(data.totalValueCents),
                user: data.user,
            })
                .then(res => {
                    data.payed = false;
                    console.log('resposta débito: ', res);
                })
                .catch(err => {
                    console.log('erro no débito: ', err);
                    throw new HttpException({
                        code: HttpStatus.NOT_ACCEPTABLE,
                        message: 'Aconteceu um erro ao finalizar a compra, por favor tente novamente em alguns minutos',
                    }, HttpStatus.NOT_ACCEPTABLE);
                });
        }

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

}
