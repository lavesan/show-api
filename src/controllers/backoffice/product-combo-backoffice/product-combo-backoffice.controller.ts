import { Controller, Put, Body, Post, Query } from '@nestjs/common';
import { ProductComboService } from 'src/services/product-combo/product-combo.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';

@Controller('backoffice/product-combo')
export class ProductComboBackofficeController {

    constructor(private readonly productComboService: ProductComboService) {}

    @Post()
    saveOne(@Body() body) {
        return this.productComboService.saveOne(body);
    }

    @Put()
    updateOne(@Body() body) {
        return this.productComboService.updateOne(body);
    }

    @Post('all')
    findAllFilteredPaginated(@Query() paginationForm: PaginationForm, @Body() filterForm: FilterForm[]) {
        this.productComboService.findAllFilteredPaginated(paginationForm, filterForm);
    }

}
