import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { jwtConsts } from './constants';
import { UserService } from '../user/user.service';
import { LoginUserForm } from 'src/model/forms/user/LoginUserForm';
import { RegisterUserForm } from 'src/model/forms/user/RegisterUserForm';
import { UserEntity } from 'src/entities/user.entity';
import { TokenPayloadType } from 'src/model/types/user.types';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async signPayload(payload: any) {
        // 12h - 12 horas
        // 12d - 12 dias
        return sign(payload, jwtConsts.secret, { expiresIn: '3d' });
    }

    async validateUser(payload): Promise<any> {
        return await this.userService.findByPayload(payload);
    }

    /**
     * @description Constructs the payload data
     * @param {UserEntity} user
     */
    private constructTokenPayload(user: UserEntity): TokenPayloadType {
        return {
            login: user.email,
            role: user.role,
            id: user.id,
        }
    }

    async loginUser(userDTO: LoginUserForm) {
        const user = await this.userService.loginUser(userDTO);
        if (user) {
            // Constructs the payload
            const payload = this.constructTokenPayload(user);
            const userData = {
                name: user.name,
                imgUrl: user.imgUrl,
            }

            const token = await this.signPayload(payload);
            return { user: userData, token };
        }
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);
    }

    // TODO: Implementar um logoff
    async logoffUser() {
        console.log('deslogar')
    }

    async registerUser(userDTO: RegisterUserForm) {
        const user = await this.userService.save(userDTO);

        if (user) {
            const payload = this.constructTokenPayload(user);
            const userData = {
                name: user.name,
                imgUrl: user.imgUrl,
            }
            const token = await this.signPayload(payload);
            return { user: userData, token };
        }
    }
}
