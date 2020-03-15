import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, In } from 'typeorm';
import * as moment from 'moment';

import { OrderEntity } from 'src/entities/order.entity';
import { OrderStatus, OrderUserWhoDeleted, OrderType } from 'src/model/constants/order.constants';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';
import { skipFromPage, paginateResponseSchema, IPaginateResponseType, generateQueryFilter, failRes, Code } from 'src/helpers/response-schema.helpers';
import { decodeToken } from 'src/helpers/auth.helpers';
import { CancelOrderForm } from 'src/model/forms/order/CancelOrderForm';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { MailType } from 'src/model/constants/sendgrid.constants';
import { SaveScheduledTimeForm } from 'src/model/forms/scheduled-time/SaveScheduledTimeForm';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
        private readonly sendgridService: SendgridService,
    ) {}

    time = {
        open: '08:00',
        close: '18:00',
    };

    save(order: Partial<OrderEntity>) {

        const data = {
            ...order,
            status: order.type === OrderType.DEBIT ? OrderStatus.WAITING_APPROVAL : OrderStatus.MADE,
            creationDate: new Date(),
        };

        if (order.user) {
            this.sendgridService.sendMail({
                type: MailType.NEW_ORDER,
                to: order.user.email,
                name: order.user.name,
                date: order.receiveDate,
                time: order.receiveTime,
                totalValue: order.totalValueCents,
                changeValue: order.changeValueCents,
                orderId: order.id,
            });
        } else {
            delete data.user;
        }

        return this.orderRepo.save(data);

    }

    async update({ orderId, orderStatus }: UpdateStatusOrderForm): Promise<UpdateResult> {

        const data = {
            updateDate: new Date(),
            status: orderStatus,
        };

        return this.orderRepo.update({ id: orderId }, data);

    }

    async softDelete(order: CancelOrderForm): Promise<UpdateResult> {

        const findOrder = this.findById(order.orderId);

        const data = {
            ...findOrder,
            status: OrderStatus.CANCELED,
            deletedReason: order.reason,
            userTypeWhoDeleted: OrderUserWhoDeleted.BACKOFFICE,
            deleteDate: new Date(),
        };

        return await this.orderRepo.update({ id: order.orderId }, data);

    }

    async findAllWithToken({ filter, paginationForm, tokenAuth }): Promise<IPaginateResponseType<any>> {

        const tokenObj = decodeToken(tokenAuth);

        if (tokenObj) {
            return await this.findAllFilteredPaginated({
                paginationForm,
                filterOpt: filter,
                id: tokenObj.id,
            });
        }

    }

    async clientCancelOrder({ orderId, reason }: CancelOrderForm): Promise<UpdateResult | any> {

        const order = await this.orderRepo.findOne({ id: orderId });

        if (order.status !== OrderStatus.SENDED && order.status !== OrderStatus.SENDING) {

            const data = {
                ...order,
                status: OrderStatus.CANCELED,
                deletedReason: reason,
                userTypeWhoDeleted: OrderUserWhoDeleted.CLIENT,
                deleteDate: new Date(),
            }

            return this.orderRepo.update({ id: orderId }, data);

        } else {

            return failRes({
                code: Code.NOT_AUTHORIZED,
                message: 'Só é possível cancelar um pedido até antes de ele estar sendo enviado',
            })

        }

    }

    async findAllFilteredPaginated({
        paginationForm: { page, take },
        filterOpt,
        id = false,
    }: any): Promise<IPaginateResponseType<any>> {

        const skip = skipFromPage(page);
        const builder = this.orderRepo.createQueryBuilder('ord')
            .leftJoinAndSelect('ord.user', 'use');

        // Vindo do ecommerce, o usuário só verá os SEUS pedidos
        if (id) {
            builder.where('ord_use_id = :userId', { userId: id });
        }

        const [result, count] = await generateQueryFilter({
            like: ['use.name'],
            numbers: ['ord_type', 'ord_status', 'ord_id'],
            equalStrings: ['ord_get_on_market'],
            valueCentsNumbers: ['ord_total_value_cents', 'ord_total_product_value_cents', 'ord_total_freight_value_cents', 'ord_change_value_cents'],
            dates: ['ord_deleted_date', 'ord_creation_date', 'ord_receive_date', 'ord_receive_time'],
            datas: Array.isArray(filterOpt) ? filterOpt : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('ord.creationDate', 'DESC')
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }

    async findById(orderId: number): Promise<OrderEntity> {
        return await this.orderRepo.findOne({ id: orderId });
    }

    async findActiveDates(dateInString: string) {

        const scheduledDates = await this.orderRepo.find({ receiveDate: dateInString });
        const compareDate = moment(this.time.open, 'HH:mm');
        const close = moment(this.time.close, 'HH:mm');

        const activeTimes = [];

        while (compareDate.isSameOrBefore(close)) {

            const comparedTime = compareDate.format('HH:mm');
            const timeIsFree = !scheduledDates.some(order => {
                const scheduledDate = moment(order.receiveTime, 'HH:mm:ss').format('HH:mm');
                return scheduledDate === comparedTime;
            });

            if (timeIsFree) {
                activeTimes.push({ time: compareDate.format('HH:mm') });
            }

            compareDate.add(30, 'minutes');

        };

        return {
            date: dateInString,
            activeTimes,
        };

    }

    async findOneBydateAndTime({ date, time }: SaveScheduledTimeForm): Promise<undefined | OrderEntity> {
        return await this.orderRepo.findOne({
            status: In([
                OrderStatus.MADE,
                OrderStatus.PREPARING,
                OrderStatus.SENDED,
                OrderStatus.SENDING,
                OrderStatus.DONE,
                OrderStatus.WAITING_APPROVAL,
            ]),
            receiveDate: date,
            receiveTime: time,
        });
    }

    async checkDebitOrder(id: number) {
        return (await this.orderRepo.findOne({
            id,
            type: OrderType.DEBIT,
            status: In([
                OrderStatus.DONE,
                OrderStatus.MADE,
                OrderStatus.SENDED,
                OrderStatus.SENDING,
                OrderStatus.PREPARING,
            ]),
        }));
    }

    findAllByUserId(userId: number) {
        return this.orderRepo.find({ user: { id: userId } });
    }

}
