import { Controller, Delete, Param, Get, Query } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';

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

}
