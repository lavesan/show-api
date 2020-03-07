import { Controller, Get, Query } from '@nestjs/common';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';

@Controller('category')
export class CategoryController {

    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Get('tree')
    findCategoryTree(@Query('categoryId') categoryId: number) {
        return this.productCategoryService.findProductCategoryTree(categoryId);
    }

    @Get('tree/all')
    async findCategoriesTree() {
        return this.productCategoryService.findAllCategoriesTree();
    }

    @Get('all')
    findAll() {
        return this.productCategoryService.findAll();
    }

}
