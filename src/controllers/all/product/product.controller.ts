import { Controller, Get, Body, Query, Post, Headers } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';

@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) {}

    @Get()
    findOne(@Query('id') productId: number) {
        return this.productService.findById(productId);
    }

    @Post('all')
    findAllFilteredPaginate(
        @Query() paginationForm: PaginationForm,
        @Body() productFilter: FilterForm[],
        @Headers('authorization') token: string,
    ) {
        return this.productService.findAllFilteredPaginate(paginationForm, productFilter, token);
    }

    @Get('tree')
    findCategoryTree(@Query('categoryId') categoryId: number) {
        return this.productService.findAllProductsByCategoryId(categoryId);
    }

}
