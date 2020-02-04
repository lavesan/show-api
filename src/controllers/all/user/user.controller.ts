import { Controller, Get, Query, Put, Body } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { ConfirmEmailForm } from 'src/model/forms/user/ConfirmEmailForm';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('verify')
    findUserByLogin(@Query('email') email: string): Promise<boolean> {
        return this.userService.findUserExistenceByEmail(email);
    }

    @Put('confirm-email')
    confirmEmail(@Body() body: ConfirmEmailForm) {
        return this.userService.confirmEmail(body);
    }

}
