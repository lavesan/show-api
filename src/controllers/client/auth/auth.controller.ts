import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AuthService } from '../../../services/auth/auth.service';
import { RegisterUserForm } from '../../../model/forms/user/RegisterUserForm';
import { LoginUserForm } from '../../../model/forms/user/LoginUserForm';

@Controller('client/auth')
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
    logoff() {
        return this.authService.logoffUser();
    }

    // Adiciona novo usuário
    @Post('register')
    register(@Body() body: RegisterUserForm) {
        return this.authService.registerUser(body);
    }

}
