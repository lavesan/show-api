import { Controller, Delete, Param, Put, Body, Headers } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';

@Controller('client/user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Delete(':id')
    softDelete(@Param('id') userId: number) {
        return this.userService.softDelete(userId);
    }

    @Put('image')
    updateImage(@Body() body: SaveImageForm) {
        return this.userService.updateImage(body);
    }

    @Put()
    updateUser(@Body() body, @Headers('authorization') tokenAuth: string) {
        return this.userService.userUpdating(body, tokenAuth);
    }

}
