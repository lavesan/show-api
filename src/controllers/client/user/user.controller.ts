import { Controller, Delete, Param, Get, Query, Body } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { SendgridService } from 'src/services/sendgrid/sendgrid.service';

@Controller('client/user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly sendgridService: SendgridService,
    ) {}

    @Delete(':id')
    softDelete(@Param('id') userId: number) {
        return this.userService.softDelete(userId);
    }

    @Get('verify')
    findUserByLogin(@Query('email') email: string): Promise<boolean> {
        return this.userService.findUserExistenceByEmail(email);
    }

    @Get('sendgrid')
    test(@Body() body) {
        this.sendgridService.sendMail(body);
    }

}
