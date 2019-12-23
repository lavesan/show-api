import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from 'src/model/constants/order.constants';

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

    async update(order: OrderEntity) {
        const data = {
            ...order,
            updateDate: new Date(),
        }

        return await this.orderRepo.update({ id: order.id }, data);
    }
}
