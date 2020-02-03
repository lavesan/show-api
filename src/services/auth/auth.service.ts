import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { LoginUserForm } from 'src/model/forms/user/LoginUserForm';
import { RegisterUserForm } from 'src/model/forms/user/RegisterUserForm';
import { UserEntity } from 'src/entities/user.entity';
import { TokenPayloadType } from 'src/model/types/user.types';
import { decodeToken, generateHashPwd } from 'src/helpers/auth.helpers';
import moment = require('moment');
import { ForgotPasswordForm } from 'src/model/forms/auth/ForgotPasswordForm';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService) {}

    async signPayload(payload: any) {
        // 12h - 12 horas
        // 12d - 12 dias
        return sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });
    }

    async validateUser(payload): Promise<any> {
        return await this.userService.findByPayload(payload);
    }

    /**
     * @description Constructs the payload data
     * @param {Partial<UserEntity>} user
     */
    private constructTokenPayload(user: Partial<UserEntity>): TokenPayloadType {
        return {
            id: user.id,
            login: user.email,
            role: user.role,
            name: user.name,
        };
    }

    async loginUser(userDTO: LoginUserForm) {

        const user = await this.userService.loginUser(userDTO);
        return this.sendJwtTokenWithUserData(user);

    }

    async refreshToken(tokenAuth: string) {

        const tokenObj = decodeToken(tokenAuth);

        const expirationDate = moment.unix(tokenObj.exp);
        const today = moment();

        if (expirationDate.isAfter(today)) {

            const user = await this.userService.findActiveById(tokenObj.id);
            return await this.sendJwtTokenWithUserData(user);

        }

        throw new HttpException({
            status: HttpStatus.UNAUTHORIZED,
            error: 'Token expirado',
        }, HttpStatus.UNAUTHORIZED);

    }

    // TODO: Implementar um logoff
    async logoffUser() {
        console.log('deslogar');
    }

    async registerUser(userDTO: RegisterUserForm) {
        const user = await this.userService.save(userDTO);

        if (user) {
            const payload = this.constructTokenPayload(user);
            const userData = {
                name: user.name,
                imgUrl: user.imgUrl,
            };

            const token = await this.signPayload(payload);
            return { user: userData, token };
        }
    }

    async forgotPassword({ email }: ForgotPasswordForm) {

        const user = await this.userService.findByEmail(email);

        if (user) {

            const generatedPwd = Math.random().toString(36).slice(-8);

            user.forgotPassword = generateHashPwd(generatedPwd);
            user.forgotPasswordCreation = new Date();

            return await this.userService.update(user);

        }

    }

    private async sendJwtTokenWithUserData(user: Partial<UserEntity>) {

        if (user) {

            // Constructs the payload
            const payload = this.constructTokenPayload(user);
            const userData = {
                name: user.name,
                imgUrl: user.imgUrl,
            };

            const token = await this.signPayload(payload);
            return { user: userData, token };
        }
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);

    }

}
