import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../../services/order/order.service';
import { OrderEntity } from '../../entities/order.entity';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';
import { OrderBackofficeController } from 'src/controllers/backoffice/order-backoffice/order-backoffice.controller';
import { ScheduledTimeModule } from '../scheduled-time/scheduled-time.module';
import { OrderController } from 'src/controllers/all/order/order.controller';
import { SendgridModule } from '../sendgrid/sendgrid.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([OrderEntity, OrderToProductEntity]),
      OrderModule,
      UserModule,
      ProductModule,
      ScheduledTimeModule,
      SendgridModule,
    ],
    controllers: [OrderBackofficeController, OrderController],
    providers: [OrderService, OrderToProductService],
})
export class OrderModule {}
