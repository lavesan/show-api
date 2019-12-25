import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from 'src/model/constants/order.constants';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { addFilter, skipFromPage, paginateResponseSchema, IPaginateResponseType } from 'src/utils/response-schema.utils';
import { decodeToken } from 'src/utils/auth.utils';

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
        id,
    }: any): Promise<IPaginateResponseType<any>> {
        // Filters
        const filter = addFilter({
            like: ['totalValueCents', 'totalProductValueCents', 'totalFreightValuesCents', 'changeValueCents'],
            equal: ['type', 'status', 'getOnMarket', 'receiveDate'],
            data: filterOpt,
        });

        // Paginate
        const skip = skipFromPage(page);
        const [users, allResultsCount] = await this.orderRepo.findAndCount({
            where: { user: { id }, ...filter },
            take,
            skip,
        });

        return paginateResponseSchema({ data: users, allResultsCount, page });
    }

    async findById(orderId: number): Promise<OrderEntity> {
        return await this.orderRepo.findOne({ id: orderId });
    }
}
