import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { jwtConsts } from './constants';
import { UserService } from '../user/user.service';
import { LoginUserForm } from 'src/model/forms/user/LoginUserForm';
import { RegisterUserForm } from 'src/model/forms/user/RegisterUserForm';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async signPayload(payload: any) {
        // 12h - 12 horas
        // 12d - 12 dias
        return sign(payload, jwtConsts.secret, { expiresIn: '3d' });
    }

    async validateUser(payload): Promise<any> {
        // return await this.userService.findByPayload(payload);
    }

    async loginUser(userDTO: LoginUserForm) {
        const user = await this.userService.loginUser(userDTO);
        if (user) {
            const payload = {
                login: user.login,
                role: user.type,
                establishment: await user.establishment,
            };
    
            const token = await this.signPayload(payload);
            return { user, token };
        }
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);
    }

    async registerUser(userDTO: RegisterUserForm) {
        const user = await this.userService.save(userDTO);

        if (user) {
            const payload = {
                login: user.login,
                role: user.type,
                establishment: await user.establishment,
            };

            const token = await this.signPayload(payload);
            return { user, token };
        }
    }
}
