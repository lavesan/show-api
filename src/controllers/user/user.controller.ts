import { Controller, Delete, Param } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Delete(':id')
    softDelete(@Param('id') userId: number) {
        return this.userService.softDelete(userId);
    }

}
