import { Controller, Get, Body, Query } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterProductForm } from 'src/model/forms/product/FilterProductForm';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Get('all')
    findAllFilteredPaginate(@Query() paginationForm: PaginationForm, @Body() productFilter: FilterProductForm) {
        return this.productService.findAllFilteredPaginate(paginationForm, productFilter);
    }

}
