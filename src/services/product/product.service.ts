import { Injectable, Inject, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';

import { ProductEntity } from 'src/entities/product.entity';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, generateQueryFilter } from 'src/helpers/response-schema.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ProductCategoryService } from '../product-category/product-category.service';
import { PromotionService } from '../promotion/promotion.service';
import { decodeToken } from 'src/helpers/auth.helpers';
import { UserRole } from 'src/model/constants/user.constants';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @Inject(forwardRef(() => ProductCategoryService))
        private readonly productCategoryService: ProductCategoryService,
        private readonly promotionService: PromotionService,
    ) {}

    // TODO: Adicionar usuário backoffice que o criou
    async saveOne({ categoryId, quantityOnStock = 0, ...product }: SaveProductForm): Promise<any> {

        const category = await this.productCategoryService.findById(categoryId);

        if (category) {
            const data = {
                ...product,
                category,
                quantityOnStock,
                creationDate: new Date(),
            };

            return await this.productRepo.save(data);
        }

        throw new HttpException({
            code: HttpStatus.NOT_FOUND,
            message: 'Categoria não encontrada',
        }, HttpStatus.NOT_FOUND);

    }

    // TODO: Adicionar usuário backoffice que o alterou
    async updateOne({ categoryId, ...product }: UpdateProductForm) {

        const category = await this.productCategoryService.findOneByIdOrFail(categoryId);
        const data = {
            ...product,
            category,
            updateDate: new Date(),
        };

        return await this.productRepo.update({ id: product.id }, data);

    }

    async delete(productId: number): Promise<DeleteResult> {
        return await this.productRepo.delete({ id: productId });
    }

    async findManyByIds(ids: number[]): Promise<ProductEntity[]> {
        return await this.productRepo.find({ id: In(ids) });
    }

    async findById(productId: number): Promise<ProductEntity> {
        return await this.productRepo.findOne({ id: productId });
    }

    async findAllProductsByCategoryId(categoryId: number) {

        const categoriesId = await this.findAllCategoriesByCategoryId(categoryId);

        return this.findManyByCategoriesIds(categoriesId);

    }

    async findAllByCategoryId(categoryId: number) {
        return this.productRepo.find({ category: { id: categoryId } });
    }

    private async findManyByCategoriesIds(categoriesId: number[]) {
        return await this.productRepo.find({ category: { id: In(categoriesId) } });
    }

    private async findAllCategoriesByCategoryId(categoryId: number) {

        const category = await this.productCategoryService.findById(categoryId);

        if (category) {
            if (category.subCategoryOfId) {
                return [
                    categoryId,
                    ...(await this.findAllCategoriesByCategoryId(category.subCategoryOfId))
                ];
            }
            return [categoryId];
        }

        return [];

    }

    async findAllFilteredPaginate({ take, page }: PaginationForm, productFilter: FilterForm[] = [], token: string): Promise<any> {

        const tokenObj = decodeToken(token);

        const skip = skipFromPage(page);
        const builder = this.productRepo.createQueryBuilder();

        let [result, count] = await generateQueryFilter({
            like: ['pro_name', 'pro_description'],
            numbers: ['pro_status', 'pro_type', 'pro_category_id'],
            valueCentsNumbers: ['pro_actual_value', 'pro_last_value'],
            datas: Array.isArray(productFilter) ? productFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .getManyAndCount();

        const roles = [UserRole.NENHUM];

        if (tokenObj) {
            roles.push(tokenObj.role);
        }

        const promoProducts = await this.promotionService.findUserPromotionProducts(roles);

        if (promoProducts.length) {

            result = result.map(product => {

                const promoProd = promoProducts.find(({ productId }) => productId === product.id);

                return {
                    ...product,
                    promotionValueCents: promoProd ? promoProd.valueCents : '',
                };

            });

        }

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });
    }

}
