import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';
import { Repository } from 'typeorm';
import { SaveOrderForm } from 'src/model/forms/order/SaveOrderForm';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderToProductService {
    constructor(
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepo: Repository<OrderToProductEntity>,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {}

    async save({ products, ...body }: SaveOrderForm) {
        const order = await this.orderService.save(body);

        if (order) {
            const insertValues = [];

            for (const productInfo of products) {
                const product = await this.productService.findById(productInfo.id);

                if (product) {
                    insertValues.push({
                        quantity: productInfo.quantity,
                        product,
                        order,
                    });
                }
            }

            return await this.orderToProductRepo.createQueryBuilder()
                .insert()
                .values(insertValues)
                .execute();
        }
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
