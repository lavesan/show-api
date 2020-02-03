import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';
import { Repository } from 'typeorm';
import { SaveOrderForm } from 'src/model/forms/order/SaveOrderForm';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { decodeToken } from 'src/helpers/auth.helpers';
import { UserService } from '../user/user.service';

@Injectable()
export class OrderToProductService {
    constructor(
        @InjectRepository(OrderToProductEntity)
        private readonly orderToProductRepo: Repository<OrderToProductEntity>,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) {}

    /**
     * @description Saves a new order
     * @param {SaveOrderForm} param0
     * @param {string} token If there's a token, use this to save the user
     */
    async save({ products, ...body }: SaveOrderForm, token: string) {
        const tokenObj = decodeToken(token);

        // If the token exists, the user is vinculated with the order
        if (tokenObj) {
            const user = await this.userService.findById(tokenObj.id);
            body.user = user;
        }

        const order = await this.orderService.save(body);

        if (order) {
            const insertValues = [];

            for (const { id, quantity } of products) {
                const productDB = await this.productService.findById(id);

                if (productDB) {
                    insertValues.push({
                        quantity,
                        product: productDB,
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
