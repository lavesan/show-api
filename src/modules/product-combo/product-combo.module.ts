import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductComboEntity } from 'src/entities/product-combo.entity';
import { ProductComboBackofficeController } from 'src/controllers/backoffice/product-combo-backoffice/product-combo-backoffice.controller';
import { ProductComboController } from 'src/controllers/all/product-combo/product-combo.controller';
import { ProductComboService } from 'src/services/product-combo/product-combo.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([ProductComboEntity]),
      ProductComboModule,
      ProductModule,
      UserModule,
    ],
    controllers: [ProductComboBackofficeController, ProductComboController],
    providers: [ProductComboService],
})
export class ProductComboModule {}
