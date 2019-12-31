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
import { GetnetModule } from './modules/getnet/getnet.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { UserBackofficeController } from './controllers/backoffice/user-backoffice/user-backoffice.controller';

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
    GetnetModule,
    ProductCategoryModule,
  ],
  controllers: [AppController, UserBackofficeController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(RoleMiddleware)
    //   .forRoutes('est-to-watter');
  }
}
