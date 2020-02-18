import { Controller, Get, Headers } from '@nestjs/common';
import { ProductComboService } from 'src/services/product-combo/product-combo.service';

@Controller('product-combo')
export class ProductComboController {

    constructor(private readonly productComboService: ProductComboService) {}

    @Get()
    findAllWithUserRole(@Headers('authorization') authorizationToken: string) {
        return this.productComboService.findAllWithUserRole(authorizationToken);
    }

}
