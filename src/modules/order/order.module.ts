import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../../services/order/order.service';
import { OrderEntity } from '../../entities/order.entity';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([OrderEntity]),
      OrderModule,
    ],
    providers: [OrderService, OrderToProductService],
    exports: [OrderService],
})
export class OrderModule {}
