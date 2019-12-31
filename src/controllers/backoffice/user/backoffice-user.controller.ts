import { Controller, Get, Query, Body } from '@nestjs/common';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { UserService } from 'src/services/user/user.service';
import { FilterForm } from 'src/model/forms/FilterForm';

@Controller('backoffice/user')
export class BackofficeUserController {

    constructor(private readonly userService: UserService) {}

    @Get('all')
    findAllUsers(@Query() paginationForm: PaginationForm, @Body() userFilter: FilterForm[]) {
        return this.userService.findAll(paginationForm, userFilter);
    }

}
