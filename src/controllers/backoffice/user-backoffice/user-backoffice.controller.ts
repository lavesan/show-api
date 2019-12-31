import { Controller, Get, Query, Body } from '@nestjs/common';
import { UserBackofficeService } from 'src/services/user-backoffice/user-backoffice.service';
import { FilterForm } from 'src/model/forms/FilterForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';

@Controller('user-backoffice')
export class UserBackofficeController {

    constructor(private readonly userBackofficeService: UserBackofficeService) {}

    @Get('all')
    findAllFilteredPaginated(@Query() paginationForm: PaginationForm, @Body() filterForm: FilterForm[]) {
        this.userBackofficeService.findAllFilteredPaginated(paginationForm, filterForm);
    }

}
