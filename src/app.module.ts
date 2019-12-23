import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { AddressModule } from './modules/address/address.module';
import { CardModule } from './modules/card/card.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { UserBackofficeModule } from './modules/user-backoffice/user-backoffice.module';
import { OrderToProductService } from './services/order-to-product/order-to-product.service';
import config = require('./ormconfig');

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    AuthModule,
    ContactModule,
    AddressModule,
    CardModule,
    OrderModule,
    ProductModule,
    UserBackofficeModule,
  ],
  controllers: [AppController],
  providers: [AppService, OrderToProductService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(RoleMiddleware)
    //   .forRoutes('est-to-watter');
  }
}
