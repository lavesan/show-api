import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { Repository, UpdateResult } from 'typeorm';
import { OrderStatus } from 'src/model/constants/order.constants';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, IPaginateResponseType, generateQueryFilter } from 'src/helpers/response-schema.helpers';
import { decodeToken } from 'src/helpers/auth.helpers';
import { DeleteOrderForm } from 'src/model/forms/order/DeleteOrderForm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
    ) {}

    async save(order: Partial<OrderEntity>) {
        const data = {
            ...order,
            status: OrderStatus.MADE,
            creationDate: new Date(),
        }

        return await this.orderRepo.save(data);
    }

    async update({ orderId, orderStatus }: UpdateStatusOrderForm) {

        const order = await this.findById(orderId);
        const data = {
            ...order,
            updateDate: new Date(),
            status: orderStatus,
        };

        return await this.orderRepo.update({ id: orderId }, data);

    }

    async softDelete(order: DeleteOrderForm): Promise<UpdateResult> {

        const findOrder = this.findById(order.id);

        const data = {
            ...findOrder,
            status: OrderStatus.CANCELED,
            deletedReason: order.reason,
            deleteDate: new Date(),
        };

        return await this.orderRepo.update({ id: order.id }, data);
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

    async findAllFilteredPaginated({
        paginationForm: { page, take },
        filterOpt,
        id = false,
    }: any): Promise<IPaginateResponseType<any>> {

        const skip = skipFromPage(page);
        const builder = this.orderRepo.createQueryBuilder();

        // Vindo do ecommerce, o usuário só verá os SEUS pedidos
        if (id) {
            builder.where('ord_use_id = :userId', { userId: id });
        }

        const [result, count] = await generateQueryFilter({
            numbers: ['ord_type', 'ord_status'],
            equalStrings: ['ord_get_on_market', 'ord_receive_date'],
            valueCentsNumbers: ['ord_total_value_cents', 'ord_total_product_value_cents', 'ord_total_freight_value_cents', 'ord_change_value_cents'],
            datas: Array.isArray(filterOpt) ? filterOpt : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });
    }

    async findById(orderId: number): Promise<OrderEntity> {
        return await this.orderRepo.findOne({ id: orderId });
    }
}
