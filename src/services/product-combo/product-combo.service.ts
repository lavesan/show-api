import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductComboEntity } from 'src/entities/product-combo.entity';
import { Repository, In, UpdateResult } from 'typeorm';
import { ProductComboStatus } from 'src/model/constants/product-combo.constants';
import { UserRole } from 'src/model/constants/user.constants';
import { decodeToken } from 'src/helpers/auth.helpers';
import { ProductService } from '../product/product.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { skipFromPage, generateQueryFilter, paginateResponseSchema } from 'src/helpers/response-schema.helpers';

@Injectable()
export class ProductComboService {

    constructor(
        @InjectRepository(ProductComboEntity)
        private readonly productComboRepo: Repository<ProductComboEntity>,
        private readonly productService: ProductService,
    ) {}

    async saveOne(body): Promise<ProductComboEntity> {

        const data = {
            ...body,
            status: ProductComboStatus.ACTIVE,
            creationData: new Date(),
        };

        return this.productComboRepo.save(data);

    }

    async updateOne({ id, ...body }): Promise<UpdateResult> {

        const data = {
            ...body,
            updateDate: new Date(),
        };

        return this.productComboRepo.update({ id }, data);

    }

    async findAllWithUserRole(token: string) {

        if (token) {
            const decodedToken = decodeToken(token) || { role: UserRole.NENHUM };
            return await this.findWithRoles([decodedToken.role, UserRole.NENHUM]);
        }

        return await this.findWithRoles([UserRole.NENHUM]);

    }

    async findAllFilteredPaginated({ page, take }: PaginationForm, filterForm: FilterForm[]) {

        const skip = skipFromPage(page);
        const builder = this.productComboRepo.createQueryBuilder();

        const [result, count] = await generateQueryFilter({
            like: ['pcb_description', 'pcb_title'],
            numbers: ['pcb_status'],
            valueCentsNumbers: ['pcb_value_cents'],
            datas: Array.isArray(filterForm) ? filterForm : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('order.creationDate', 'DESC')
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }

    private async findWithRoles(roles: UserRole[]) {

        let combos = [];

        try {
            combos = await this.productComboRepo
                .createQueryBuilder()
                .where('pcb_users_roles_will_appear @> array[:roles]::text[]', { roles })
                .getMany();

        } finally {

            const combosMaped = combos.map(async combo => {

                let products = [];

                try {
                    products = await this.productService.findManyByIds(combo.productsIds);
                } finally {
                    return { ...combo, products };
                }

            });

            return combosMaped;

        }

    }

}
