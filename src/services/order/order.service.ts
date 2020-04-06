import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
import { ContactService } from '../contact/contact.service';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
        private readonly sendgridService: SendgridService,
        private readonly contactService: ContactService,
    ) {}

    time = {
        activeWeek: {
            interval1: {
                open: '10:00',
                close: '13:00',
            },
            interval2: {
                open: '16:30',
                close: '19:30',
            },
        },
        saturday: {
            open: '10:00',
            close: '13:00',
        },
    };

    save(order: Partial<OrderEntity>) {

        const data = {
            ...order,
            status: OrderStatus.TO_FINISH,
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

    updateOrder({ id, ...order }: Partial<OrderEntity>) {

        const data = {
            ...order,
            updateDate: new Date(),
        }

        return this.orderRepo.update({ id }, data);

    }

    async update({ orderId, orderStatus, getnetPaymentId = null, cardCode = null }: any): Promise<UpdateResult> {

        const data: any = {
            updateDate: new Date(),
            status: orderStatus,
        };

        if (getnetPaymentId) {
            data.getnetPaymentId = getnetPaymentId;
        }
        if (cardCode) {
            data.cardCode = cardCode;
        }

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

    findAllWithToken({ filter, paginationForm, id }): Promise<IPaginateResponseType<any>> {

        return this.findAllFilteredPaginated({
            paginationForm,
            filterOpt: filter,
            id,
        });

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
            .leftJoinAndSelect('ord.user', 'use')
            .leftJoinAndSelect('ord.address', 'adr')
            .leftJoinAndSelect('ord.contact', 'con')
            .where('ord_status != :value', { value: 0 });

        // Vindo do ecommerce, o usuário só verá os SEUS pedidos
        if (id) {
            builder.where('ord_use_id = :userId', { userId: id });
        }

        const [result, count] = await generateQueryFilter({
            like: ['use.name', 'use.email'],
            numbers: ['ord_type', 'ord_status', 'ord_id'],
            equalStrings: ['ord_get_on_market'],
            valueCentsNumbers: ['ord_total_value_cents', 'ord_total_product_value_cents', 'ord_total_freight_value_cents', 'ord_change_value_cents'],
            dates: ['ord_deleted_date', 'ord_creation_date', 'ord_receive_date', 'ord_receive_time'],
            datas: Array.isArray(filterOpt) ? filterOpt : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('ord.receiveDate', 'DESC')
            .getManyAndCount();


        for (let i = 0; i < result.length; i++) {

            if (result[i].user) {

                const contacts = await this.contactService.findAllByUserId(result[i].user.id);

                result[i] = {
                    ...result[i],
                    contacts,
                };

            }

            if (result[i].contact) {
                result[i] = {
                    ...result[i],
                    contacts: [result[i].contact],
                };
            }

        }

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }

    async findById(orderId: number): Promise<OrderEntity> {
        return await this.orderRepo.findOne({ id: orderId });
    }

    async findActiveDates(dateInString: string) {

        const dateInMoment = moment(dateInString, 'DD/MM/YYYY');
        const translatedDate = dateInMoment.format('MM/DD/YYYY');

        const scheduledDates = await this.orderRepo.find({ receiveDate: translatedDate });

        const dayOfWeek = dateInMoment.day();

        const freeDates = {
            date: dateInString,
            activeTimes: [],
        };

        if (dayOfWeek === 0) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Não atendemos neste dia',
            }, HttpStatus.BAD_REQUEST);
        } else if (dayOfWeek === 6) {

            const hours = this.getActiveHoursFromIntaval({
                scheduledDates,
                from: this.time.saturday.open,
                to: this.time.saturday.close,
            });
            freeDates.activeTimes = freeDates.activeTimes.concat(hours);

        } else {

            const morning = this.getActiveHoursFromIntaval({
                scheduledDates,
                from: this.time.activeWeek.interval1.open,
                to: this.time.activeWeek.interval1.close,
            });

            const night = this.getActiveHoursFromIntaval({
                scheduledDates,
                from: this.time.activeWeek.interval2.open,
                to: this.time.activeWeek.interval2.close,
            });

            freeDates.activeTimes = [
                ...morning,
                ...night,
            ];
        }

        return freeDates;

    }

    private getActiveHoursFromIntaval({
        scheduledDates,
        from,
        to,
    }) {

        const compareDate = moment(from, 'HH:mm');
        const close = moment(to, 'HH:mm');

        const activeTimes = [];

        while (compareDate.isSameOrBefore(close)) {

            const comparedTime = compareDate.format('HH:mm');
            const timeIsFree = !scheduledDates.some(order => {
                const scheduledDate = moment(order.receiveTime, 'HH:mm:ss').format('HH:mm');
                return scheduledDate === comparedTime;
            });

            activeTimes.push({
                active: timeIsFree,
                time: compareDate.format('HH:mm'),
            });

            compareDate.add(1, 'hours');

        };

        return activeTimes;

    }

    async findOneBydateAndTime({ date, time }: SaveScheduledTimeForm): Promise<undefined | OrderEntity> {
        return await this.orderRepo.findOne({
            status: In([
                OrderStatus.TO_FINISH,
                OrderStatus.MADE,
                OrderStatus.PREPARING,
                OrderStatus.SENDED,
                OrderStatus.SENDING,
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
                OrderStatus.MADE,
                OrderStatus.PREPARING,
                OrderStatus.SENDING,
                OrderStatus.SENDED,
            ]),
        }));
    }

    findAllByUserId(userId: number) {
        return this.orderRepo.find({
            user: { id: userId },
            status: In([
                OrderStatus.MADE,
                OrderStatus.PREPARING,
                OrderStatus.SENDING,
                OrderStatus.SENDED,
            ]),
        });
    }

    findAllWaitingApproval() {
        return this.orderRepo.find({ status: OrderStatus.TO_FINISH });
    }

    deleteMany(ids: number[]) {
        return this.orderRepo.delete({ id: In(ids) });
    }

    async findAllLength() {

        const orders = await this.orderRepo.find({
            status: In([
                OrderStatus.MADE,
                OrderStatus.PREPARING,
                OrderStatus.SENDING,
                OrderStatus.SENDED,
            ]),
        });

        return {
            length: orders.length,
        };

    }

    findManyByUserId(userId: number) {
        return this.orderRepo.find({ user: { id: userId } });
    }

}
