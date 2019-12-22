import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterUserForm } from '../../model/forms/user/RegisterUserForm';
import { LoginUserForm } from '../../model/forms/user/LoginUserForm';

@Controller('auth')
export class AuthController {
    constructor(
       private readonly authService: AuthService,
    ) {}

    // Retorna token do usuário
    @Post('login')
    logIn(@Body() body: LoginUserForm) {

    }

    // Token no header
    @Delete('logoff')
    logoff() {

    }

    // Adiciona novo usuário
    @Post('register')
    register(@Body() body: RegisterUserForm) {

    }
}
