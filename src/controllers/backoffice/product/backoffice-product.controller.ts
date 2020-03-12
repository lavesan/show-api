import { Controller, Body, Post, Put, Delete, Param, Query, Get } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { ProductEntity } from 'src/entities/product.entity';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';
import { ActivationProduct } from 'src/model/forms/product/ActivationProduct';
import { UpdateStockForm } from 'src/model/forms/product/UpdateStockForm';

@Controller('backoffice/product')
export class BackofficeProductController {

    constructor(private readonly productService: ProductService) {}

    @Post()
    saveOne(@Body() body: SaveProductForm): Promise<ProductEntity> {
        return this.productService.saveOne(body);
    }

    @Put()
    updateOne(@Body() body: UpdateProductForm): Promise<UpdateResult> {
        return this.productService.updateOne(body);
    }

    @Put()
    updateImage(@Body() body: SaveImageForm) {
        return {
            message: 'alterar isso aqui',
        };
    }

    @Delete(':id')
    deleteOne(@Param('id') productId: number): Promise<DeleteResult> {
        return this.productService.delete(productId);
    }

    @Get('actives')
    findAllActives(): Promise<ProductEntity[]> {
        return this.productService.findAllActives();
    }

    @Get('all')
    findAll(): Promise<ProductEntity[]> {
        return this.productService.findAll();
    }

    @Get('promotion/all')
    findAllProductsFromPromotion(@Query('id') promotionId: number) {
        return this.productService.findAllProductsFromPromotion(promotionId);
    }

    @Get('combo/all')
    findAllProductsFromCombo(@Query('id') comboId: number) {
        return this.productService.findAllProductsFromCombo(comboId);
    }

    @Put('activate')
    activateProduct(@Body() body: ActivationProduct) {
        return this.productService.activationProduct(body);
    }

    @Put('stock')
    updateStock(@Body() body: UpdateStockForm) {
        return this.productService.updateStock(body);
    }

}
