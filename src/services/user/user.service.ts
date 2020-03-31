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
import { CardService } from '../card/card.service';
import { IUserLoginReturnedData } from 'src/model/types/user.types';
const uploadAmazon = require('../../helpers/amazon.helpers');

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly contactService: ContactService,
        private readonly addressService: AddressService,
        private readonly cardService: CardService,
    ) {}

    async save(user: RegisterUserForm) {

        try {

            if (!user.termOfContract) {
                throw new HttpException({
                    code: HttpStatus.NOT_ACCEPTABLE,
                    message: 'É obrigatório aceitar o termo de contrato.',
                }, HttpStatus.NOT_ACCEPTABLE);
            }

            const foundUser = await this.findByEmail(user.email);

            if (foundUser) {
                throw new HttpException({
                    code: HttpStatus.BAD_REQUEST,
                    message: 'Já existe um usuário com este email.',
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

            const contacts = [];
            if (contact) {

                const contactData = {
                    ...contact,
                    userId: newUser.id,
                }

                contacts.push(await this.contactService.save(contactData));

            }

            const addresses = [];
            if (address) {

                const addressData = {
                    ...address,
                    userId: newUser.id,
                }

                addresses.push(await this.addressService.save(addressData));

            }

            return {
                ...removePwd(newUser),
                addresses,
                contacts,
                cards: [],
            };

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
    async loginUser({ login, password }: LoginUserForm): Promise<IUserLoginReturnedData> {
        // Para o modo `eager` funcionar, preciso pesquisar com os métodos `find`, `findOne`, `findAndCount`...
        // ! Não utilizar o `createQueryBuilder`, senão tudo perdido e precisarei usar o `leftJoin` e pa
        const user = await this.userRepo.findOne({
            select: ['id', 'email', 'password', 'name', 'role', 'forgotPassword', 'forgotPasswordCreation'],
            where: { email: login, status: UserStatus.ACTIVE },
        });

        if (user) {

            if (comparePwdWithHash(password, user.password)) {

                const contacts = await this.contactService.findAllByUserId(user.id);
                const addresses = await this.addressService.findAllByUserId(user.id);
                const cards = await this.cardService.findAllByUserId(user.id);

                return {
                    ...removePwd(user),
                    contacts,
                    addresses,
                    cards,
                };

            } else if (user.forgotPassword && comparePwdWithHash(password, user.forgotPassword)) {

                const fromTime = moment(user.forgotPasswordCreation);
                const untilTime = fromTime.clone().add(2, 'hours');

                const isValidTime = moment().isBetween(fromTime, untilTime);

                if (isValidTime) {

                    user.password = user.forgotPassword;
                    user.forgotPassword = null;
                    user.forgotPasswordCreation = null;

                    await this.update(user);

                    const userData = await this.getUserInfo(user.id);

                    return {
                        ...removePwd(user),
                        ...userData,
                    };

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

        const user = await this.userRepo.findOne({ id: userId, status: UserStatus.ACTIVE });

        const userData = await this.getUserInfo(user.id);

        return {
            ...user,
            ...userData,
        };

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

    async updateImage({ id, imgUrl }: SaveImageForm) {

        const fileUrl = await uploadAmazon.default().uploadImg(imgUrl, `user-${id}`);

        await this.userRepo.update({ id }, { imgUrl: fileUrl });

        return {
            imgUrl: fileUrl,
        };

    }

    private async getUserInfo(userId: number) {

        const contacts = await this.contactService.findAllByUserId(userId);
        const addresses = await this.addressService.findAllByUserId(userId);
        const cards = await this.cardService.findAllByUserId(userId);

        return {
            contacts,
            addresses,
            cards,
        }

    }

}
