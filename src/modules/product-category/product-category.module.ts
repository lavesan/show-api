import { Module } from '@nestjs/common';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';
import { ProductCategoryEntity } from 'src/entities/productCategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/backoffice/category/category.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProductCategoryEntity])],
    controllers: [CategoryController],
    providers: [ProductCategoryService],
    exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
