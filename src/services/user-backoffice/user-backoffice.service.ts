import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import * as moment from 'moment';

import { UserBackofficeEntity } from 'src/entities/user-backoffice.entity';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';
import { generateHashPwd, decodeToken, comparePwdWithHash } from 'src/helpers/auth.helpers';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, generateQueryFilter, successRes } from 'src/helpers/response-schema.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ResetPasswordUserBackofficeForm } from 'src/model/forms/user-backoffice/ResetPasswordUserBackofficeForm';
import { UserBackofficeStatus, UserBackofficeRole } from 'src/model/constants/user-backoffice.constants';
import { removeAdminPwd } from 'src/helpers/user.helpers';
import { ActivationUserBackofficeForm } from 'src/model/forms/user-backoffice/ActivationUserBackofficeForm';
import { UpdateLoggedUserForm } from 'src/model/forms/user-backoffice/UpateLoggedUserForm';

@Injectable()
export class UserBackofficeService {

    constructor(
        @InjectRepository(UserBackofficeEntity)
        private readonly userBackofficeRepo: Repository<UserBackofficeEntity>,
    ) {}

    async findOneById(userId: number) {
        return this.userBackofficeRepo.findOne(userId);
    }

    async findByPayload(payload: any): Promise<any> {
        const { login } = payload;
        return await this.userBackofficeRepo.findOne({ email: login });
    }

    /**
     * @description Uses bcrypt to compare the password
     * @param {LoginUserForm} param0
     */
    async loginUser({ login, password }: any): Promise<UserBackofficeEntity> {
        // Para o modo `eager` funcionar, preciso pesquisar com os métodos `find`, `findOne`, `findAndCount`...
        // ! Não utilizar o `createQueryBuilder`, senão tudo perdido e precisarei usar o `leftJoin` e pa
        const user = await this.userBackofficeRepo.findOne({
            select: ['id', 'email', 'password', 'name', 'role', 'forgotPassword', 'forgotPasswordCreation'],
            where: { email: login, status: UserBackofficeStatus.ACTIVE },
        });

        if (user) {

            if (comparePwdWithHash(password, user.password)) {
                // Encontrou o usuário e a senha está correta
                delete user.password;
                return user;

            } else if (comparePwdWithHash(password, user.forgotPassword)) {

                const fromTime = moment(user.forgotPasswordCreation);
                const untilTime = fromTime.clone().add(2, 'hours');

                const isValidTime = moment().isBetween(fromTime, untilTime);

                if (isValidTime) {

                    user.password = user.forgotPassword;
                    user.forgotPassword = null;
                    user.forgotPasswordCreation = null;

                    await this.update(user);

                    // Encontrou o usuário e a senha está correta
                    delete user.password;
                    return user;

                }

                user.forgotPassword = null;
                user.forgotPasswordCreation = null;

                await this.update(user);

                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: 'Tempo para alterar o password esgotado.',
                }, HttpStatus.NOT_ACCEPTABLE);

            } else {

                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: 'Senha incorreta',
                }, HttpStatus.NOT_ACCEPTABLE);

            }
        }

        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);

    }

    async findActiveById(userId: number) {
        return this.userBackofficeRepo.findOne({
            select: ['email', 'id', 'role', 'name'],
            where: { id: userId, status: UserBackofficeStatus.ACTIVE },
        });
    }

    /**
     * @description Apenas um administrador vai puder criar novos usuários
     */
    async save({ confirmPassword, password, ...userBackofficeForm }: SaveUserBackofficeForm) {

        if (confirmPassword !== password) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                message: 'As senhas não conferem',
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        const data = {
            ...userBackofficeForm,
            emailConfirmed: false,
            password: generateHashPwd(password),
            creationDate: new Date(),
        };

        return this.userBackofficeRepo.save(data);

    }

    private async findByIdWithToken({ id, token }) {
        return this.userBackofficeRepo.findOne({ id, resetPassowrdToken: token });
    }

    async update({ id, ...updateUserBackofficeForm }: Partial<UserBackofficeEntity>): Promise<UpdateResult> {

        const administrators = await this.userBackofficeRepo.find({ role: UserBackofficeRole.ADMIN, status: UserBackofficeStatus.ACTIVE });

        if (administrators.length === 1 && administrators[0].id === id) {
            throw new HttpException({
                code: HttpStatus.FORBIDDEN,
                message: 'Este é o último administrador ativo. É obrigatório que se tenha ao menos um administrador ativo.',
            }, HttpStatus.FORBIDDEN)
        }

        return this.userBackofficeRepo.update({ id }, updateUserBackofficeForm);

    }

    async resetPassword({ newPassword, token }: ResetPasswordUserBackofficeForm): Promise<UpdateResult> {

        const decodedToken = decodeToken(token);

        if (decodedToken) {

            try {

                const user = await this.findByIdWithToken({ id: decodedToken.id, token });
                user.password = newPassword;
                user.resetPassowrdToken = '';

                return this.userBackofficeRepo.update({ id: decodedToken.id }, user);

            } catch (err) {
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    message: 'Token inválido.',
                }, HttpStatus.NOT_ACCEPTABLE)
            }

        }

        throw new HttpException({
            status: HttpStatus.NOT_ACCEPTABLE,
            message: 'Token inválido.',
        }, HttpStatus.NOT_ACCEPTABLE)

    }

    /**
     * @description Apenas um usuário backoffice administrador poderá deletar
     */
    async delete(userBackofficeId: number): Promise<DeleteResult> {
        return this.userBackofficeRepo.delete({ id: userBackofficeId });
    }

    async findAllFilteredPaginated({ take, page }: PaginationForm, userBackofficeFilter: FilterForm[], token: string) {

        const skip = skipFromPage(page);
        const builder = this.userBackofficeRepo.createQueryBuilder('usb');

        const tokenObj = decodeToken(token);

        if (tokenObj && tokenObj.id) {
            builder.where('usb.id != :id', { id: tokenObj.id });
        }

        let [result, count] = await generateQueryFilter({
            like: ['usb_name', 'usb_email'],
            numbers: ['usb_role', 'usb_status'],
            datas: Array.isArray(userBackofficeFilter) ? userBackofficeFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('usb_id', 'ASC')
            .getManyAndCount();

        result = result.map(user => removeAdminPwd(user));

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }

    findByEmail(email: string): Promise<UserBackofficeEntity> {
        return this.userBackofficeRepo.findOne({ email });
    }

    async manageActivation({ id, status }: ActivationUserBackofficeForm) {

        const administrators = await this.userBackofficeRepo.find({ role: UserBackofficeRole.ADMIN, status: UserBackofficeStatus.ACTIVE });

        if (administrators.length === 1 && administrators[0].id === id) {
            throw new HttpException({
                code: HttpStatus.FORBIDDEN,
                message: 'Este é o último administrador ativo. É obrigatório que se tenha ao menos um administrador ativo.',
            }, HttpStatus.FORBIDDEN)
        }

        return this.userBackofficeRepo.update({ id }, { status });

    }

    updateLoggedUser({ id, password, ...body }: UpdateLoggedUserForm) {

        const data: any = {
            ...body,
            updateDate: new Date(),
        }

        if (password) {
            data.password = generateHashPwd(password);
        }

        return this.userBackofficeRepo.update({ id }, data);

    }

}
