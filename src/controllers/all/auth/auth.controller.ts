import { Controller, Post, Body, Delete, Headers, Request, Put } from '@nestjs/common';
import * as fs from 'fs';

import { AuthService } from '../../../services/auth/auth.service';
import { RegisterUserForm } from '../../../model/forms/user/RegisterUserForm';
import { LoginUserForm } from '../../../model/forms/user/LoginUserForm';
import { AdminAuthService } from 'src/services/admin-auth/admin-auth.service';
import { ForgotPasswordForm } from 'src/model/forms/auth/ForgotPasswordForm';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';

interface IAppCredentials {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    type: string;
}

@Controller('oauth/auth')
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
    @Post()
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

    @Post('user/refresh-token')
    userRefreshToken(@Headers('authorization') tokenAuth: string) {
        return this.authService.refreshToken(tokenAuth);
    }

    @Post('user-backoffice/refresh-token')
    adminRefreshToken(@Headers('authorization') tokenAuth: string) {
        return this.adminAuthService.refreshToken(tokenAuth);
    }

    // Adiciona novo usuário
    @Post('user/register')
    registerUser(@Body() body: RegisterUserForm) {
        return this.authService.registerUser(body);
    }

    @Post('user-backoffice/register')
    registerAdmin(@Body() body: SaveUserBackofficeForm) {
        return this.adminAuthService.registerUser(body);
    }

    @Put('user/forgot-password')
    userForgotPassword(@Body() body: ForgotPasswordForm) {
        return this.authService.forgotPassword(body);
    }

    @Put('user-backoffice/forgot-password')
    adminForgotPassword(@Body() body: ForgotPasswordForm) {
        return this.adminAuthService.forgotPassword(body);
    }

    private platform(body) {
        return this.appCredentials.find(
            ({ CLIENT_ID, CLIENT_SECRET }) =>
            CLIENT_ID === body.CLIENT_ID && CLIENT_SECRET === body.CLIENT_SECRET
        );
    }

}
