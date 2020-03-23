import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as moment from 'moment';

import { UserEntity } from '../../entities/user.entity';
import { RegisterUserForm } from '../../model/forms/user/RegisterUserForm';
import { UserRole, UserStatus } from '../../model/constants/user.constants';
import { generateHashPwd, comparePwdWithHash } from '../../helpers/auth.helpers';
import { LoginUserForm } from 'src/model/forms/user/LoginUserForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { paginateResponseSchema, skipFromPage, generateQueryFilter, successRes } from 'src/helpers/response-schema.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ConfirmEmailForm } from 'src/model/forms/user/ConfirmEmailForm';
import { ActivationUserForm } from 'src/model/forms/user/ActivationUserForm';
import { ChangeUserRoleForm } from 'src/model/forms/user/ChangeUserRoleForm';
import { ContactService } from '../contact/contact.service';
import { AddressService } from '../address/address.service';
import { removePwd } from 'src/helpers/user.helpers';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly contactService: ContactService,
        private readonly addressService: AddressService,
    ) {}

    async save(user: RegisterUserForm): Promise<UserEntity> {

        try {

            const foundUser = await this.findByEmail(user.email);

            if (foundUser) {
                throw new HttpException({
                    code: HttpStatus.BAD_REQUEST,
                    message: 'Já existe um usuário com este email.'
                }, HttpStatus.BAD_REQUEST);
            }

            const { contact, address, ...userData } = user;

            const data = {
                ...userData,
                emailConfirmed: false,
                status: UserStatus.ACTIVE,
                role: UserRole.NENHUM,
                choosenRole: userData.role,
                creationDate: new Date(),
                password: generateHashPwd(userData.password),
            };
            const newUser = await this.userRepo.save(data);

            if (contact) {

                const contactData = {
                    ...contact,
                    userId: newUser.id,
                }

                await this.contactService.save(contactData);

            }
            if (address) {

                const addressData = {
                    ...address,
                    userId: newUser.id,
                }

                await this.addressService.save(addressData);

            }

            return newUser;

        } catch(err) {
            throw new HttpException({
                ...err,
            }, HttpStatus.BAD_GATEWAY);
        }

    }

    async update(user: Partial<UserEntity>): Promise<UpdateResult> {
        const data = {
            ...user,
            updateDate: new Date(),
        }
        return await this.userRepo.update({ id: user.id }, data);
    }

    async findByPayload(payload: any): Promise<any> {
        const { login } = payload;
        return await this.userRepo.findOne({ email: login });
    }

    /**
     * @description Uses bcrypt to compare the password
     * @param {LoginUserForm} param0
     */
    async loginUser({ login, password }: LoginUserForm): Promise<UserEntity> {
        // Para o modo `eager` funcionar, preciso pesquisar com os métodos `find`, `findOne`, `findAndCount`...
        // ! Não utilizar o `createQueryBuilder`, senão tudo perdido e precisarei usar o `leftJoin` e pa
        const user = await this.userRepo.findOne({
            select: ['id', 'email', 'password', 'name', 'role', 'forgotPassword', 'forgotPasswordCreation'],
            where: { email: login, status: UserStatus.ACTIVE },
        });

        if (user) {

            if (comparePwdWithHash(password, user.password)) {
                // Encontrou o usuário e a senha está correta
                delete user.password;
                return user;

            } else if (user.forgotPassword && comparePwdWithHash(password, user.forgotPassword)) {

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
        return this.userRepo.findOne({
            select: ['email', 'id', 'role', 'name'],
            where: { id: userId, status: UserStatus.ACTIVE },
        });
    }

    async updatePassword({ login, password }: LoginUserForm): Promise<any> {
        const user = await this.userRepo.findOne({
            where: { login , status: 1 },
        });

        if (user) {
            user.updateDate = new Date();
            user.password = generateHashPwd(password);

            return await this.userRepo.update({ email: login }, user);
        }
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);
    }

    // TODO: Implementar a paginação
    async findAllPaginated(): Promise<any> {
        return await this.userRepo.findAndCount();
    }

    async findById(userId: number): Promise<UserEntity> {
        return await this.userRepo.findOne({ id: userId });
    }

    async findOneByIdOrFail(userId: number): Promise<UserEntity> {
        return await this.userRepo.findOneOrFail({ id: userId });
    }

    /**
     * @description Inactivates the user
     * @param {number} userId
     */
    async softDelete(userId: number): Promise<any> {
        const user = await this.findById(userId);

        if (user) {
            user.status = UserStatus.INACTIVE;

            return await this.userRepo.update({ id: user.id }, user);
        }
    }

    async findAll({ take, page }: PaginationForm, userFilter: FilterForm[]): Promise<any> {
        const skip = skipFromPage(page);
        const builder = this.userRepo.createQueryBuilder();

        let [result, count] = await generateQueryFilter({
            like: ['use_email', 'use_description', 'use_name'],
            numbers: ['use_age', 'use_role', 'use_status'],
            datas: Array.isArray(userFilter) ? userFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('use_id', 'ASC')
            .getManyAndCount();

            result = result.map(user => removePwd(user));

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return await this.userRepo.findOne({ email, status: UserStatus.ACTIVE });
    }

    async findUserExistenceByEmail(email: string): Promise<boolean> {
        const user = await this.userRepo.findOne({ email });
        return Boolean(user);
    }

    async confirmEmail(body: ConfirmEmailForm) {

        const data = {
            ...body,
            emailConfirmed: true,
        }

        return await this.update(data);

    }

    activationUser({ id, status }: ActivationUserForm): Promise<UpdateResult> {
        return this.userRepo.update({ id }, { status });
    }

    changeRole({ id, role }: ChangeUserRoleForm) {
        return this.userRepo.update({ id }, { role });
    }

    async findAddressAndContact(userId: number) {

        const addresses = await this.addressService.findAllByUserId(userId);
        const phones = await this.contactService.findAllByUserId(userId);

        return {
            addresses,
            phones,
        }

    }

    updateImage({ id, imgUrl }: SaveImageForm) {
        return this.userRepo.update({ id }, { imgUrl });
    }

}
