import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';
import { SaveCategoryForm } from 'src/model/forms/product-category/SaveCategoryForm';

@Controller('backoffice/category')
export class CategoryController {

    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Post()
    saveOne(@Body() saveCategoryForm: SaveCategoryForm) {
        return this.productCategoryService.save(saveCategoryForm);
    }

    @Get()
    findCategoryTree(@Query('categoryId') categoryId: number) {
        return this.productCategoryService.findProductCategoryTree(categoryId);
    }

}
