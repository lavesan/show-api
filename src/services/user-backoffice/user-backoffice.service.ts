import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBackofficeEntity } from 'src/entities/userBackoffice.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';
import { generateHashPwd } from 'src/utils/auth.utils';
import { UpdateUserBackofficeForm } from 'src/model/forms/user-backoffice/UpdateUserBackofficeForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, generateQueryFilter } from 'src/utils/response-schema.utils';
import { FilterForm } from 'src/model/forms/FilterForm';

@Injectable()
export class UserBackofficeService {

    constructor(
        @InjectRepository(UserBackofficeEntity)
        private readonly userBackofficeRepo: Repository<UserBackofficeEntity>,
    ) {}

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

        this.userBackofficeRepo.save(data);
    }

    async update({ id, ...updateUserBackofficeForm }: UpdateUserBackofficeForm): Promise<UpdateResult> {
        return this.userBackofficeRepo.update({ id }, updateUserBackofficeForm);
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
            numbers: ['usb_role'],
            datas: Array.isArray(userBackofficeFilter) ? userBackofficeFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });
    }

}
