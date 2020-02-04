import { Controller, Get, Body, Query, Post } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { GetnetService } from 'src/services/getnet/getnet.service';

@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
        private readonly getnetService: GetnetService,
    ) {}

    @Get('all')
    findAllFilteredPaginate(@Query() paginationForm: PaginationForm, @Body() productFilter: FilterForm[]) {
        return this.productService.findAllFilteredPaginate(paginationForm, productFilter);
    }

    @Get('category/tree')
    findCategoryTree(@Query('categoryId') categoryId: number) {
        return this.productService.findAllProductsByCategoryId(categoryId);
    }

}
