import { Controller, Body, Post, Put, Delete, Param, Query, Get } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';

@Controller('backoffice/product')
export class BackofficeProductController {

    constructor(private readonly productService: ProductService) {}

    @Post()
    saveOne(@Body() body: SaveProductForm): Promise<any[]> {
        return this.productService.saveOne(body);
    }

    @Put()
    updateOne(@Body() body: UpdateProductForm) {
        return this.productService.updateOne(body);
    }

    @Delete(':id')
    deleteOne(@Param('id') productId: number): Promise<DeleteResult> {
        return this.productService.delete(productId);
    }

}
