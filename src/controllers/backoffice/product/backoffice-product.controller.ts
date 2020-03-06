import { Controller, Body, Post, Put, Delete, Param, Query, Get } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ProductEntity } from 'src/entities/product.entity';

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

    @Get('all')
    findAll(): Promise<ProductEntity[]> {
        return this.productService.findAll();
    }

    @Get('promotion/all')
    findAllProductsFromPromotion(@Query('id') promotionId: number) {
        return this.productService.findAllProductsFromPromotion(promotionId);
    }

}
