import { Controller, Post, Body, Delete, UseGuards, Headers, Request, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';

import { AuthService } from '../../../services/auth/auth.service';
import { RegisterUserForm } from '../../../model/forms/user/RegisterUserForm';
import { LoginUserForm } from '../../../model/forms/user/LoginUserForm';
import { AUTH_CONSTS } from 'src/helpers/auth.helpers';
import { AdminAuthService } from 'src/services/admin-auth/admin-auth.service';
import { ForgotPasswordForm } from 'src/model/forms/auth/ForgotPasswordForm';

interface IAppCredentials {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    type: string;
}

@Controller('auth')
export class AuthController {

    appCredentials: IAppCredentials[];

    constructor(
       private readonly authService: AuthService,
       private readonly adminAuthService: AdminAuthService,
    ) {
        const rawData: any = fs.readFileSync('./src/app-credentials.json');
        this.appCredentials = JSON.parse(rawData);
    }

    // Retorna token do usuário
    @Post('login')
    logIn(@Body() body: LoginUserForm) {

        const { type } = this.platform(body);

        const handlePlatform = {
            ecommerce: (payload) => this.authService.loginUser(payload),
            admin: (payload) => this.adminAuthService.loginUser(payload),
        }

        return handlePlatform[type](body);

    }

    // Token no header
    @Delete('logoff')
    logoff(@Request() req) {
        req.logout();
        return this.authService.logoffUser();
    }

    @Post('refresh-token')
    @UseGuards(AuthGuard([AUTH_CONSTS.ADMIN, AUTH_CONSTS.CLIENT]))
    refreshToken(@Headers('authorization') tokenAuth: string) {
        return this.authService.refreshToken(tokenAuth);
    }

    // Adiciona novo usuário
    @Post('register')
    register(@Body() body: RegisterUserForm) {

        const { type } = this.platform(body);

        const handlePlatform = {
            ecommerce: (payload) => this.authService.registerUser(payload),
            admin: (payload) => this.adminAuthService.registerUser(payload),
        }
        return handlePlatform[type](body);

    }

    @Put('forgot-password')
    forgotPassword(@Body() body: ForgotPasswordForm) {

        const { type } = this.platform(body);

        const handlePlatform = {
            ecommerce: (payload) => this.authService.forgotPassword(payload),
            admin: (payload) => this.adminAuthService.registerUser(payload),
        }
        return handlePlatform[type](body);

    }

    private platform(body) {
        return this.appCredentials.find(
            ({ CLIENT_ID, CLIENT_SECRET }) =>
            CLIENT_ID === body.CLIENT_ID && CLIENT_SECRET === body.CLIENT_SECRET
        );
    }

}
