import { Controller, Get } from '@nestjs/common';
import { ProductComboService } from 'src/services/product-combo/product-combo.service';

@Controller('product-combo')
export class ProductComboController {

    constructor(private readonly productComboService: ProductComboService) {}

    @Get()
    findAll() {
        return this.productComboService.findAll();
    }

}
