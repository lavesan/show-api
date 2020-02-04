import { Controller, Get } from '@nestjs/common';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';

@Controller('category')
export class CategoryController {

    constructor(private readonly productCategoryService: ProductCategoryService) {}

    @Get('tree/all')
    async findCategoriesTree() {
        return this.productCategoryService.findAllCategoriesTree();
    }

}
