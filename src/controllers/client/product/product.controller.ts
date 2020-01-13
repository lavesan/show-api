import { Controller, Get, Body, Query, Post } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { GetnetService } from 'src/services/getnet/getnet.service';

@Controller('client/product')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
        private readonly getnetService: GetnetService,
    ) {}

    @Get('all')
    findAllFilteredPaginate(@Query() paginationForm: PaginationForm, @Body() productFilter: FilterForm[]) {
        return this.productService.findAllFilteredPaginate(paginationForm, productFilter);
    }

    @Get()
    findCategoryTree(@Query('categoryId') categoryId: number) {
        return this.productService.findAllProductsByCategoryId(categoryId);
    }

    //TODO: Remover TODAS as requisições abaixo
    @Post('getnet-login')
    loginGetnet(): any {
        return this.getnetService.writeAuthTokenOnFile();
    }

    @Post('getnet-pay-credit')
    payCredit(): any {
        return this.getnetService.payCredit({ card_number: '5155901222280001' });
    }

    @Post('getnet-pay-debit')
    payDebit(): any {
        return this.getnetService.payDebit({ card_number: '5155901222280001' });
    }

}
