import { Module, forwardRef } from '@nestjs/common';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';
import { ProductCategoryEntity } from 'src/entities/productCategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryBackofficeController } from 'src/controllers/backoffice/category/category.controller';
import { ProductModule } from '../product/product.module';
import { CategoryController } from 'src/controllers/all/category/category.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductCategoryEntity]),
        forwardRef(() => ProductModule),
    ],
    controllers: [
        CategoryBackofficeController,
        CategoryController,
    ],
    providers: [ProductCategoryService],
    exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
