import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../../services/order/order.service';
import { OrderEntity } from '../../entities/order.entity';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([OrderEntity, OrderToProductEntity]),
      OrderModule,
      UserModule,
      ProductModule,
    ],
    providers: [OrderService, OrderToProductService],
    exports: [OrderService],
})
export class OrderModule {}
