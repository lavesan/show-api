import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, In } from 'typeorm';

import { ProductEntity } from 'src/entities/product.entity';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, generateFilter, generateQueryFilter } from 'src/utils/response-schema.utils';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ProductCategoryService } from '../product-category/product-category.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @Inject(forwardRef(() => ProductCategoryService))
        private readonly productCategoryService: ProductCategoryService,
    ) {}

    // TODO: Adicionar usuário backoffice que o criou
    async saveMany(products: SaveProductForm[]): Promise<any> {
        for (const { categoryId, ...product } of products) {

            const category = await this.productCategoryService.findOneByIdOrFail(categoryId);
            const data = {
                ...product,
                category,
                creationDate: new Date(),
            };

            await this.productRepo.save(data);
        }
        return { code: 1, message: 'Produtos salvos' };
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

    // TODO: Adiciona os filtros de paginação
    async findAllFilteredPaginate({ take, page }: PaginationForm, productFilter: FilterForm[] = []): Promise<any> {
        // Filters
        // const filter = generateFilter({
        //     like: ['name', 'description', 'actualValueCents'],
        //     numbers: ['status', 'category', 'type'],
        //     equalStrings: ['creationDate'],
        //     datas: Array.isArray(productFilter) ? productFilter : [],
        // });

        // const skip = skipFromPage(page);
        // const [products, allResultsCount] = await this.productRepo.findAndCount({
        //     where: { ...filter },
        //     take,
        //     skip,
        // });
        const skip = skipFromPage(page);
        const builder = this.productRepo.createQueryBuilder();

        const [result, count] = await generateQueryFilter({
            like: ['pro_name', 'pro_description', 'pro_actual_value', 'pro_last_value'],
            numbers: ['pro_status', 'pro_type', 'pro_category_id'],
            datas: Array.isArray(productFilter) ? productFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });
    }

}
