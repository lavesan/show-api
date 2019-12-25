import { Controller, Body, Post, Put, Delete, Param } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';

@Controller('backoffice/product')
export class BackofficeProductController {

    constructor(private readonly productService: ProductService) {}

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
