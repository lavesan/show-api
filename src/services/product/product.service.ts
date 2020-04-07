import { Injectable, Inject, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In, UpdateResult } from 'typeorm';

import { ProductEntity } from 'src/entities/product.entity';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, generateQueryFilter } from 'src/helpers/response-schema.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ProductCategoryService } from '../product-category/product-category.service';
import { PromotionService } from '../promotion/promotion.service';
import { decodeToken } from 'src/helpers/auth.helpers';
import { ActivationProduct } from 'src/model/forms/product/ActivationProduct';
import { UpdateStockForm } from 'src/model/forms/product/UpdateStockForm';
import { ProductStatus } from 'src/model/constants/product.constants';
import { ProductComboService } from '../product-combo/product-combo.service';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';
import { IDebitProductQuantity } from 'src/model/types/product.types';
const uploadAmazon = require('../../helpers/amazon.helpers');

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @Inject(forwardRef(() => ProductCategoryService))
        private readonly productCategoryService: ProductCategoryService,
        private readonly promotionService: PromotionService,
        private readonly comboService: ProductComboService,
    ) {}

    // TODO: Adicionar usuário backoffice que o criou
    async saveOne({ categoryId, quantityOnStock = 0, ...product }: SaveProductForm): Promise<ProductEntity> {

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
    async updateOne({ categoryId, ...product }: UpdateProductForm): Promise<UpdateResult> {

        const category = await this.productCategoryService.findOneByIdOrFail(categoryId)
            .catch(() => {
                throw new HttpException({
                    code: HttpStatus.NOT_FOUND,
                    message: 'Categoria não encontrada',
                }, HttpStatus.NOT_FOUND);
            });
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

    async findAllProductsFromPromotion(promotionId: number) {

        const prodPromo = await this.promotionService.findAllProductsByPromotionIds([promotionId]);
        const productsIds = prodPromo.map(pro => pro.productId);
        const products = await this.findManyByIds(productsIds);
        return products.map(product => {

            const productPromotion = prodPromo.find(proPm => proPm.productId === product.id);

            let promotionValueCents = '000';
            if (productPromotion) {
                promotionValueCents = productPromotion.valueCents;
            }

            return {
                ...product,
                promotionValueCents,
            }

        });

    }

    findAllProductsFromCombo(comboId: number) {
        return this.comboService.findAllProductsFromCombo(comboId);
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

    activationProduct({ id, status }: ActivationProduct) {
        return this.productRepo.update({ id }, { status });
    }

    async findAllFilteredPaginate({ take, page }: PaginationForm, productFilter: FilterForm[] = [], token: string = ''): Promise<any> {

        const skip = page ? skipFromPage(page) : '';
        let builder = this.productRepo.createQueryBuilder('pro')
            .leftJoinAndSelect('pro.category', 'cat');

        const tokenObj = decodeToken(token);

        const filters = Array.isArray(productFilter) ? productFilter : [];

        const catFilterIndex = filters.findIndex(filter => filter.field === 'cat.id');

        if (typeof catFilterIndex === 'number' && catFilterIndex >= 0) {

            const found = filters[catFilterIndex];
            const ids = await this.productCategoryService.findAllCategoryByCategoryId(Number(found.value));

            filters[catFilterIndex] = {
                ...filters[catFilterIndex],
                value: ids,
            }

        }

        builder = generateQueryFilter({
            like: ['pro_name', 'pro_description', 'cat.name'],
            numbers: ['pro_status', 'pro_quantity_on_stock'],
            inValues: ['cat.id'],
            valueCentsNumbers: ['pro_actual_value', 'pro_last_value'],
            dates: ['pro_creation_date'],
            datas: filters,
            builder,
        })
            .orderBy('pro.id', 'ASC');

        if (typeof skip === 'number') {
            builder = builder.skip(skip);
        }

        if (take) {
            builder = builder.take(10);
        }

        let [result, count] = await builder.getManyAndCount();

        if (!tokenObj || (tokenObj && tokenObj.type === 'ecommerce')) {
            result = result.filter(product => product.status === ProductStatus.ACTIVE);
        }

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }

    findAll(): Promise<ProductEntity[]> {
        return this.productRepo.find();
    }

    findAllActives(): Promise<ProductEntity[]> {
        return this.productRepo.find({ status: ProductStatus.ACTIVE });
    }

    updateStock({ id, quantityOnStock }: UpdateStockForm) {
        return this.productRepo.update({ id }, { quantityOnStock })
    }

    findPromotionProducts(token: string) {
        return this.promotionService.findPromotionsFromUser(token)
            .then(async res => {

                const mappedResponse = [];
                for (const promo of res) {

                    const productsIds = promo.products.map(({ id }) => id);
                    const products = await this.findAllProductsFromPromotions(productsIds);

                    const mappedProds = products.map(prod => {

                        const promoProd = promo.products.find(pro => pro.id === prod.id);

                        let returnData = { ...prod };

                        if (promoProd) {
                            returnData = {
                                ...returnData,
                                ...promoProd,
                                promotionalValueCents: promoProd.valueCents,
                            }
                        }

                        return returnData;

                    })

                    const data = {
                        ...promo,
                        products: mappedProds,
                    };

                    mappedResponse.push(data);

                }

                return mappedResponse;

            });
    }

    async debitQuantityOnStock(debitProductQuantity: IDebitProductQuantity[]) {

        for (const { id, quantity } of debitProductQuantity) {
            await this.productRepo.createQueryBuilder()
                .update()
                .set({ quantityOnStock: () => `pro_quantity_on_stock - ${quantity}` })
                .where('id = :id', { id })
                .execute();
        }

    }

    async addQuantitiesOnStock(debitProductQuantity: IDebitProductQuantity[]) {

        for (const { id, quantity } of debitProductQuantity) {
            await this.productRepo.createQueryBuilder()
                .update()
                .set({ quantityOnStock: () => `pro_quantity_on_stock + ${quantity}` })
                .where('id = :id', { id })
                .execute();
        }

    }

    async findAllProductsWithCategories() {

        const allCategories = await this.productCategoryService.findAll();

        const result = [];

        for (const cat of allCategories) {

            const products = await this.productRepo.find({
                category: { id: cat.id },
                status: ProductStatus.ACTIVE,
            });
            result.push({
                category: cat,
                products,
            })

        }

        return result;

    }

    async updateImage({ id, imgUrl }: SaveImageForm) {

        const fileUrl = await uploadAmazon.default().uploadImg(imgUrl, `product-${id}`);

        await this.productRepo.update({ id }, { imgUrl: fileUrl });

        return {
            imgUrl: fileUrl,
        };

    }

    findAllActiveByIds(productIds: number[]) {
        return this.productRepo.find({ id: In(productIds), status: ProductStatus.ACTIVE });
    }

    findAllProductsFromPromotions(productsIds: number[]) {
        return this.productRepo.find({ id: In(productsIds), status: ProductStatus.ACTIVE });
    }

}
