import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import moment = require('moment');

import { UserBackofficeService } from '../user-backoffice/user-backoffice.service';
import { LoginUserForm } from 'src/model/forms/user/LoginUserForm';
import { TokenPayloadType } from 'src/model/types/user.types';
import { decodeToken, generateHashPwd } from 'src/helpers/auth.helpers';
import { UserBackofficeEntity } from 'src/entities/user-backoffice.entity';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';
import { ForgotPasswordForm } from 'src/model/forms/auth/ForgotPasswordForm';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { MailType } from 'src/model/constants/sendgrid.constants';

@Injectable()
export class AdminAuthService {

    constructor(
        private readonly userBackofficeService: UserBackofficeService,
        private readonly sendgridService: SendgridService,
    ) {}

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
            type: 'admin',
            id: user.id,
            login: user.email,
            role: user.role,
            name: user.name,
        };
    }

    async loginUser(userDTO: LoginUserForm) {

        const user = await this.userBackofficeService.loginUser(userDTO);
        console.log('user: ', user)
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

    async forgotPassword({ email }: ForgotPasswordForm) {

        const user = await this.userBackofficeService.findByEmail(email);

        if (user) {

            const generatedPwd = Math.random().toString(36).slice(-8);

            user.forgotPassword = generateHashPwd(generatedPwd);
            user.forgotPasswordCreation = new Date();

            await this.userBackofficeService.update(user);

            this.sendgridService.sendMail({
                type: MailType.FORGOT_PWD_ADMIN,
                name: user.name,
                to: user.email,
                password: generatedPwd,
            });

            return user;

        }

        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            message: 'Usuário não encontrado.',
        }, HttpStatus.NOT_FOUND)

    }

    private async sendJwtTokenWithUserData(user: any) {

        if (user) {

            // Constructs the payload
            const payload = this.constructTokenPayload(user);
            const userData = {
                id: user.data.id,
                name: user.data.name,
                role: user.data.role,
                email: user.data.email,
                imgUrl: user.data.imgUrl,
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
