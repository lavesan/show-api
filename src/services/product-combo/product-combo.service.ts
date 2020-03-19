import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComboEntity } from 'src/entities/combo.entity';
import { Repository, In } from 'typeorm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { skipFromPage, generateQueryFilter, paginateResponseSchema } from 'src/helpers/response-schema.helpers';
import { ComboToProductEntity } from 'src/entities/combo-to-product.entity';
import { ActivationComboForm } from 'src/model/forms/combo/ActivationComboForm';
import { UpdateComboForm } from 'src/model/forms/combo/UpdateComboForm';
import { SaveComboForm } from 'src/model/forms/combo/SaveComboForm';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';
import { ProductComboStatus } from 'src/model/constants/product-combo.constants';

@Injectable()
export class ProductComboService {

    constructor(
        @InjectRepository(ComboEntity)
        private readonly comboRepo: Repository<ComboEntity>,
        @InjectRepository(ComboToProductEntity)
        private readonly comboToProductRepo: Repository<ComboToProductEntity>,
    ) {}

    async saveOne({ products, ...body }: SaveComboForm) {

        const data = {
            ...body,
            creationDate: new Date(),
        };

        const result = await this.comboRepo.save(data);

        const insertValues = [];

        for (const { id, quantity } of products) {
            insertValues.push({
                combo: { id: result.id },
                product: { id },
                quantity,
            })
        }
        const insertedProducts = await this.comboToProductRepo.createQueryBuilder()
            .insert()
            .values(insertValues)
            .execute();

        return {
            ...result,
            products: insertedProducts,
        };

    }

    async updateOne({ comboId, products, ...body }: UpdateComboForm) {

        const data = {
            ...body,
            updateDate: new Date(),
        };

        await this.comboRepo.update({ id: comboId }, data);
        const savedProducts = await this.comboToProductRepo.find({ combo: { id: comboId } });

        const result = {
            updated: [],
            saved: {},
            deleted: {},
        };
        const productsToInsert = [];

        for (const { id, quantity } of products) {
            if (savedProducts.some(prod => {
                return prod.product.id === id;
            })) {
                // Updates the product sent
                const updated = await this.comboToProductRepo.update({
                    product: { id },
                    combo: { id: comboId },
                }, { quantity })
                    .catch(err => {
                        console.log('é aqui....', err);
                    });
                result.updated.push(updated);
            } else {
                productsToInsert.push({
                    quantity,
                    product: { id },
                    combo: { id: comboId },
                });
            }
        }

        // Saves the products sent but not stored
        if (productsToInsert.length) {
            result.saved = await this.comboToProductRepo.createQueryBuilder()
                .insert()
                .values(productsToInsert)
                .execute()
                    .catch(() => {
                        throw new HttpException({
                            code: HttpStatus.NOT_FOUND,
                            message: 'Um dos produtos não foi encontrado.',
                        }, HttpStatus.NOT_FOUND);
                    });
        }

        // Remove the products not sent
        const productsToRemove = savedProducts.filter(savProd => {
            return !products.some(prod => {
                return prod.id === savProd.product.id;
            });
        });

        if (productsToRemove.length) {
            const productsIds = productsToRemove.map(prod => prod.product.id);
            result.deleted = await this.comboToProductRepo.delete({ product: { id: In(productsIds) }, combo: { id: comboId } });
        }

        return result;

    }

    async findAll() {

        const combos = await this.comboRepo.find({
            status: ProductComboStatus.ACTIVE,
        });

        const result = [];

        for (const combo of combos) {

            const products = await this.comboToProductRepo.find({
                combo: { id: combo.id },
            });

            result.push({
                ...combo,
                products,
            });

        }

        return result;

    }

    async findAllFilteredPaginated({ page, take }: PaginationForm, filterForm: FilterForm[]) {

        const skip = skipFromPage(page);
        const builder = this.comboRepo.createQueryBuilder();

        const [result, count] = await generateQueryFilter({
            like: ['cob_description', 'cob_title', 'cob_brief_description'],
            numbers: ['cob_status'],
            valueCentsNumbers: ['cob_value_cents'],
            datas: Array.isArray(filterForm) ? filterForm : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('cob_id', 'ASC')
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }

    async delete(comboId: number) {
        await this.comboToProductRepo.delete({ combo: { id: comboId } });
        return this.comboRepo.delete({ id: comboId });
    }

    activate({ comboId, status }: ActivationComboForm) {
        return this.comboRepo.update({ id: comboId }, { status });
    }

    async findAllProductsFromCombo(comboId: number) {
        return this.comboToProductRepo.find({ combo: { id: comboId } });
    }

    updateImage({ id, imgUrl }: SaveImageForm) {
        return this.comboRepo.update({ id }, { imgUrl });
    }

}
