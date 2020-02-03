import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBackofficeEntity } from 'src/entities/user-backoffice.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';
import { generateHashPwd, decodeToken, comparePwdWithHash } from 'src/helpers/auth.helpers';
import { UpdateUserBackofficeForm } from 'src/model/forms/user-backoffice/UpdateUserBackofficeForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, generateQueryFilter } from 'src/helpers/response-schema.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ResetPasswordUserBackofficeForm } from 'src/model/forms/user-backoffice/ResetPasswordUserBackofficeForm';
import { ResetPasswordUserBackofficeMailForm } from 'src/model/forms/user-backoffice/ResetPasswordUserBackofficeMailForm';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { UserBackofficeStatus } from 'src/model/constants/user-backoffice.constants';

@Injectable()
export class UserBackofficeService {

    constructor(
        @InjectRepository(UserBackofficeEntity)
        private readonly userBackofficeRepo: Repository<UserBackofficeEntity>,
        private readonly sendgridService: SendgridService,
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
            select: ['id', 'email', 'password', 'name', 'role'],
            where: { email: login, status: UserBackofficeStatus.ACTIVE },
        });

        if (user) {

            if (comparePwdWithHash(password, user.password)) {
                // Encontrou o usuário e a senha está correta
                delete user.password;
                return await Promise.resolve(user);

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
            password: generateHashPwd(password),
            creationDate: new Date(),
        };

        return this.userBackofficeRepo.save(data);

    }

    private async findByIdWithToken({ id, token }) {
        return this.userBackofficeRepo.findOne({ id, resetPassowrdToken: token });
    }

    async update({ id, ...updateUserBackofficeForm }: UpdateUserBackofficeForm): Promise<UpdateResult> {
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

    async findAllFilteredPaginated({ take, page }: PaginationForm, userBackofficeFilter: FilterForm[]) {
        // Filters
        // const filter = generateFilter({
        //     like: ['name', 'email'],
        //     numbers: ['role'],
        //     datas: Array.isArray(userBackofficeFilter) ? userBackofficeFilter : [],
        // });

        // const skip = skipFromPage(page);
        // const [products, allResultsCount] = await this.userBackofficeRepo.findAndCount({
        //     where: { ...filter },
        //     take,
        //     skip,
        // });

        // return paginateResponseSchema({ data: products, allResultsCount, page, limit: take });
        const skip = skipFromPage(page);
        const builder = this.userBackofficeRepo.createQueryBuilder();

        const [result, count] = await generateQueryFilter({
            like: ['usb_name', 'usb_email'],
            numbers: ['usb_role', 'usb_status'],
            datas: Array.isArray(userBackofficeFilter) ? userBackofficeFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });
    }

    private async findByEmail(email: string): Promise<UserBackofficeEntity> {
        return this.userBackofficeRepo.findOne({ email });
    }

    async resetPasswordMail({ email }: ResetPasswordUserBackofficeMailForm) {

        const user = await this.findByEmail(email);

        if (user) {

            // TODO: Atualizar com o e-mail do cara e pa

            return this.sendgridService.sendMail({
                type: 'forgotPasswordAdmin',
                to: user.email, 
                name: user.name,
            });

        }

        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            message: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);

    }

}
