import { Controller, Put, Body, Post, Query, Delete, Param } from '@nestjs/common';
import { ProductComboService } from 'src/services/product-combo/product-combo.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';
import { SaveComboForm } from 'src/model/forms/combo/SaveComboForm';
import { UpdateComboForm } from 'src/model/forms/combo/UpdateComboForm';
import { ActivationComboForm } from 'src/model/forms/combo/ActivationComboForm';

@Controller('backoffice/product-combo')
export class ProductComboBackofficeController {

    constructor(private readonly productComboService: ProductComboService) {}

    @Post()
    saveOne(@Body() body: SaveComboForm) {
        return this.productComboService.saveOne(body);
    }

    @Put()
    updateOne(@Body() body: UpdateComboForm) {
        return this.productComboService.updateOne(body);
    }

    @Put('activate')
    activation(@Body() body: ActivationComboForm) {
        return this.productComboService.activate(body);
    }

    @Delete(':id')
    delete(@Param('id') comboId: number) {
        return this.productComboService.delete(comboId);
    }

    @Put('image')
    updateImage(@Body() body: SaveImageForm) {
        return this.productComboService.updateImage(body);
    }

    @Post('all')
    findAllFilteredPaginated(@Query() paginationForm: PaginationForm, @Body() filterForm: FilterForm[]) {
        return this.productComboService.findAllFilteredPaginated(paginationForm, filterForm);
    }

}
