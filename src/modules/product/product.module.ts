import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product.entity';
import { ProductController } from 'src/controllers/all/product/product.controller';
import { BackofficeProductController } from 'src/controllers/backoffice/product/backoffice-product.controller';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { PromotionModule } from '../promotion/promotion.module';
import { ProductComboModule } from '../product-combo/product-combo.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([ProductEntity]),
      forwardRef(() => ProductCategoryModule),
      ProductComboModule,
      PromotionModule,
      ProductModule,
    ],
    controllers: [ProductController, BackofficeProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
