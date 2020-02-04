import { Controller, Delete, Param, Get, Query, Body, Put } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { ConfirmEmailForm } from 'src/model/forms/user/ConfirmEmailForm';

@Controller('client/user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Delete(':id')
    softDelete(@Param('id') userId: number) {
        return this.userService.softDelete(userId);
    }

    @Get('verify')
    findUserByLogin(@Query('email') email: string): Promise<boolean> {
        return this.userService.findUserExistenceByEmail(email);
    }

    @Put('confirm-email')
    confirmEmail(@Body() body: ConfirmEmailForm) {
        return this.userService.confirmEmail(body);
    }

}
