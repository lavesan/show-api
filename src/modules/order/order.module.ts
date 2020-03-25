import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../../services/order/order.service';
import { OrderEntity } from '../../entities/order.entity';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderToProductEntity } from 'src/entities/orderToProduct.entity';
import { OrderBackofficeController } from 'src/controllers/backoffice/order-backoffice/order-backoffice.controller';
import { OrderController } from 'src/controllers/all/order/order.controller';
import { SendgridModule } from '../sendgrid/sendgrid.module';
import { GetnetModule } from '../getnet/getnet.module';
import { PromotionModule } from '../promotion/promotion.module';
import { ProductComboModule } from '../product-combo/product-combo.module';
import { AddressModule } from '../address/address.module';
import { ContactModule } from '../contact/contact.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([OrderEntity, OrderToProductEntity]),
      OrderModule,
      UserModule,
      ProductModule,
      SendgridModule,
      GetnetModule,
      PromotionModule,
      ProductComboModule,
      AddressModule,
      ContactModule,
    ],
    controllers: [OrderBackofficeController, OrderController],
    providers: [OrderService, OrderToProductService],
    exports: [OrderToProductService],
})
export class OrderModule {}
