import { Controller, Query, Body, Post, Delete, Param } from '@nestjs/common';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { UserService } from 'src/services/user/user.service';
import { FilterForm } from 'src/model/forms/FilterForm';

@Controller('backoffice/user')
export class BackofficeUserController {

    constructor(private readonly userService: UserService) {}

    @Post('all')
    findAllUsers(@Query() paginationForm: PaginationForm, @Body() userFilter: FilterForm[]) {
        return this.userService.findAll(paginationForm, userFilter);
    }

    @Delete(':id')
    deleteOne(@Param('id') userId: number) {
        return this.userService.softDelete(userId);
    }

}
