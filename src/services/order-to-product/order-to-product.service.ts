import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderToProductService {
    constructor(
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepo: Repository<OrderToProductEntity>,
    ) {}

    async save() {
        // TODO: Salvar produtos com a ordem que ele foi feito
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
}
