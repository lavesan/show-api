import { Controller, Get, Post, Body, Put, Delete, Param, Query } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterProductForm } from 'src/model/forms/product/FilterProductForm';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    findAllFilteredPaginate(@Query() paginationForm: PaginationForm, @Body() productFilter: FilterProductForm) {
        return this.productService.findAllFilteredPaginate(paginationForm, productFilter);
    }

    @Post()
    saveMany(@Body() body: SaveProductForm[]): Promise<any[]> {
        return this.productService.saveMany(body);
    }

    @Put()
    updateOne(@Body() body: UpdateProductForm): Promise<UpdateResult> {
        return this.productService.updateOne(body);
    }

    @Delete(':id')
    deleteOne(@Param('id') productId: number): Promise<DeleteResult> {
        return this.productService.delete(productId);
    }
}
