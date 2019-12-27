import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product.entity';
import { ProductController } from 'src/controllers/client/product/product.controller';
import { BackofficeProductController } from 'src/controllers/backoffice/product/backoffice-product.controller';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([ProductEntity]),
      ProductModule,
      ProductCategoryModule,
    ],
    controllers: [ProductController, BackofficeProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
