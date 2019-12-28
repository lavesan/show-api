import { Module } from '@nestjs/common';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';
import { ProductCategoryEntity } from 'src/entities/productCategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/backoffice/category/category.controller';
import { ProductModule } from '../product/product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductCategoryEntity]),
        ProductModule,
    ],
    controllers: [CategoryController],
    providers: [ProductCategoryService],
    exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
