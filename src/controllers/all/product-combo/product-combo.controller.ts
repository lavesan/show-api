import { Controller, Get } from '@nestjs/common';
import { ProductComboService } from 'src/services/product-combo/product-combo.service';

@Controller('combo')
export class ProductComboController {

    constructor(private readonly productComboService: ProductComboService) {}

    @Get('all')
    findAll() {
        return this.productComboService.findAll();
    }

}
