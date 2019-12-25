import { Controller, Get, Query, Body } from '@nestjs/common';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterUserDataForm } from 'src/model/forms/user/FilterUserDataForm';
import { UserService } from 'src/services/user/user.service';

@Controller('backoffice/user')
export class BackofficeUserController {

    constructor(private readonly userService: UserService) {}

    @Get('all')
    findAllUsers(@Query() paginationForm: PaginationForm, @Body() userFilter: FilterUserDataForm) {
        return this.userService.findAll(paginationForm, userFilter);
    }

}
