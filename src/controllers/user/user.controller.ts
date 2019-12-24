import { Controller, Delete, Param, Get, Query, Body } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterUserDataForm } from 'src/model/forms/user/FilterUserDataForm';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Delete(':id')
    softDelete(@Param('id') userId: number) {
        return this.userService.softDelete(userId);
    }

    @Get('all')
    findAllUsers(@Query() paginationForm: PaginationForm, @Body() userFilter: FilterUserDataForm) {
        return this.userService.findAll(paginationForm, userFilter);
    }

    @Get('verify')
    findUserByLogin(@Query('email') email: string): Promise<boolean> {
        return this.userService.findUserExistenceByEmail(email);
    }

}
