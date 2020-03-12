import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboEntity } from 'src/entities/combo.entity';
import { ComboToProductEntity } from 'src/entities/combo-to-product.entity';
import { ProductComboBackofficeController } from 'src/controllers/backoffice/product-combo-backoffice/product-combo-backoffice.controller';
import { ProductComboController } from 'src/controllers/all/product-combo/product-combo.controller';
import { ProductComboService } from 'src/services/product-combo/product-combo.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([ComboToProductEntity, ComboEntity]),
      ProductComboModule,
    ],
    controllers: [ProductComboBackofficeController, ProductComboController],
    providers: [ProductComboService],
    exports: [ProductComboService],
})
export class ProductComboModule {}
