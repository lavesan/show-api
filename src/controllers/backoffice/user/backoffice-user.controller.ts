import { Controller, Query, Body, Post, Delete, Param, Put, Get } from '@nestjs/common';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { UserService } from 'src/services/user/user.service';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ActivationUserForm } from 'src/model/forms/user/ActivationUserForm';

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

    @Put('activate')
    activateProduct(@Body() body: ActivationUserForm) {
        return this.userService.activationUser(body);
    }

}
