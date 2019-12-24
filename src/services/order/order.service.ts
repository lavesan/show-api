import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from 'src/model/constants/order.constants';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';

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

    async findById(orderId: number): Promise<OrderEntity> {
        return await this.orderRepo.findOne({ id: orderId });
    }
}
