import { Controller, Post, Body, Delete, UseGuards, Headers, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../../../services/auth/auth.service';
import { RegisterUserForm } from '../../../model/forms/user/RegisterUserForm';
import { LoginUserForm } from '../../../model/forms/user/LoginUserForm';

@Controller('auth')
export class AuthController {

    constructor(
       private readonly authService: AuthService,
    ) {}

    // Retorna token do usuário
    @Post('login')
    logIn(@Body() body: LoginUserForm) {
        return this.authService.loginUser(body);
    }

    // Token no header
    @Delete('logoff')
    @UseGuards(AuthGuard('jwt'))
    logoff(@Request() req) {
        req.logout();
        return this.authService.logoffUser();
    }

    @Post('refresh-token')
    @UseGuards(AuthGuard('jwt'))
    refreshToken(@Headers('authorization') tokenAuth: string) {
        return this.authService.refreshToken(tokenAuth);
    }

    // Adiciona novo usuário
    @Post('register')
    register(@Body() body: RegisterUserForm) {
        return this.authService.registerUser(body);
    }

}
