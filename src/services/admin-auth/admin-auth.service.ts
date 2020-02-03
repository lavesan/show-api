import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import moment = require('moment');

import { UserBackofficeService } from '../user-backoffice/user-backoffice.service';
import { sign } from 'jsonwebtoken';
import { LoginUserForm } from 'src/model/forms/user/LoginUserForm';
import { RegisterUserForm } from 'src/model/forms/user/RegisterUserForm';
import { UserEntity } from 'src/entities/user.entity';
import { TokenPayloadType } from 'src/model/types/user.types';
import { decodeToken } from 'src/helpers/auth.helpers';
import { UserBackofficeEntity } from 'src/entities/user-backoffice.entity';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';

@Injectable()
export class AdminAuthService {

    constructor(private readonly userBackofficeService: UserBackofficeService) {}

    async signPayload(payload: any) {
        // 12h - 12 horas
        // 12d - 12 dias
        return sign(payload, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '3d' });
    }

    async validateUser(payload): Promise<any> {
        return await this.userBackofficeService.findByPayload(payload);
    }

    /**
     * @description Constructs the payload data
     * @param {Partial<UserBackofficeEntity>} user
     */
    private constructTokenPayload(user: Partial<UserBackofficeEntity>): TokenPayloadType {
        return {
            id: user.id,
            login: user.email,
            role: user.role,
            name: user.name,
        };
    }

    async loginUser(userDTO: LoginUserForm) {

        const user = await this.userBackofficeService.loginUser(userDTO);
        return this.sendJwtTokenWithUserData(user);

    }

    async refreshToken(tokenAuth: string) {

        const tokenObj = decodeToken(tokenAuth);

        const expirationDate = moment.unix(tokenObj.exp);
        const today = moment();

        if (expirationDate.isAfter(today)) {

            const user = await this.userBackofficeService.findActiveById(tokenObj.id);
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

    async registerUser(userDTO: SaveUserBackofficeForm) {

        const user = await this.userBackofficeService.save(userDTO);

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

    private async sendJwtTokenWithUserData(user: Partial<UserBackofficeEntity>) {

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
