import { Controller, Get, Body, Query } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ProductCategoryService } from 'src/services/product-category/product-category.service';

@Controller('client/product')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
        private readonly productCategoryService: ProductCategoryService,
    ) {}

    @Get('all')
    findAllFilteredPaginate(@Query() paginationForm: PaginationForm, @Body() productFilter: FilterForm[]) {
        return this.productService.findAllFilteredPaginate(paginationForm, productFilter);
    }

    @Get()
    findCategoryTree(@Query('categoryId') categoryId: number) {
        return this.productService.findAllProductsByCategoryId(categoryId);
    }

}
