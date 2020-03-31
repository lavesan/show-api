import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionEntity } from 'src/entities/promotion.entity';
import { Repository, In } from 'typeorm';
import { ProductPromotionEntity } from 'src/entities/product-promotion.entity';
import { SavePromotionForm } from 'src/model/forms/promotion/SavePromotionForm';
import { UpdatePromotionForm } from 'src/model/forms/promotion/UpdatePromotionForm';
import { ActivationPromotion } from 'src/model/forms/promotion/ActivationPromotion';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';
import { UserRole } from 'src/model/constants/user.constants';
import { decodeToken } from 'src/helpers/auth.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, generateQueryFilter, paginateResponseSchema } from 'src/helpers/response-schema.helpers';
import { PromotionStatus } from 'src/model/constants/promotion.constants';
const uploadAmazon = require('../../helpers/amazon.helpers');

@Injectable()
export class PromotionService {

    constructor(
        @InjectRepository(PromotionEntity)
        private readonly promotionRepo: Repository<PromotionEntity>,
        @InjectRepository(ProductPromotionEntity)
        private readonly productPromotionRepo: Repository<ProductPromotionEntity>,
    ) {}

    async save({ products, ...body }: SavePromotionForm) {

        const data = {
            ...body,
            creationDate: new Date(),
        };

        const promotion = await this.promotionRepo.save(data);

        if (promotion) {

            const insertValues = [];

            for (const { valueCents, id } of products) {
                insertValues.push({
                    valueCents,
                    productId: id,
                    promotionId: promotion.id,
                });
            }

            return await this.productPromotionRepo.createQueryBuilder()
                .insert()
                .values(insertValues)
                .execute()
                    .catch(() => {
                        throw new HttpException({
                            code: HttpStatus.NOT_FOUND,
                            message: 'Um dos produtos não foi encontrado.',
                        }, HttpStatus.NOT_FOUND)
                    });

        }

        throw new HttpException({
            code: HttpStatus.NOT_FOUND,
            message: 'Aconteceu um erro ao criar a promoção, por favor tente mais tarde.',
        }, HttpStatus.NOT_FOUND)

    }

    async findPromotionsFromUser(token: string) {

        const tokenObj = decodeToken(token);

        const roles = [UserRole.NENHUM];

        if (tokenObj) {
            roles.push(tokenObj.role);
        }

        return this.findUserPromotion(roles);

    }

    private async findUserPromotion(userRoles: UserRole[]): Promise<any> {

        const promotions = await this.promotionRepo.createQueryBuilder('promo')
            .where('promo.userTypes @> ARRAY[:userRoles]::INTEGER[]', { userRoles: userRoles.toString() })
            .where('prm_status = :status', { status: PromotionStatus.ACTIVE })
            .getMany();

        if (!promotions.length) {
            return [];
        }

        const promoIds = promotions.map(({ id }) => id);

        const products = await this.findAllProductsByPromotionIds(promoIds);

        return promotions.map(promo => {

            const promoProducts = products.filter(({ promotionId }) => promotionId === promo.id);

            return {
                ...promo,
                products: promoProducts,
            };

        });

    }

    async findPromotionBestPricesFromUser(token: string) {

        const tokenObj = decodeToken(token);

        const roles = [UserRole.NENHUM];

        if (tokenObj) {
            roles.push(tokenObj.role);
        }

        return this.findBestPriceProducts(roles);

    }

    private async findBestPriceProducts(userRoles: UserRole[]): Promise<any[]> {

        const promotions = await this.promotionRepo.createQueryBuilder('promo')
            .where('promo.userTypes @> ARRAY[:userRoles]::INTEGER[]', { userRoles: userRoles.toString() })
            .where('prm_status = :status', { status: PromotionStatus.ACTIVE })
            .getMany();

        if (!promotions.length) {
            return [];
        }

        const promoIds = promotions.map(({ id }) => id);

        const products = await this.findAllProductsByPromotionIds(promoIds);

        const aux = {};

        products.forEach(product => {

            if (!aux[product.productId]) {
                aux[product.productId] = [product];
            } else {
                aux[product.productId].push(product);
            }

        });

        return Object.values(aux).map((prodsProms: any[]) => {

            let prod = prodsProms[0];
            prodsProms.forEach(seiLa => {
                if (prod.valueCents > seiLa.valueCents) {
                    prod = seiLa;
                }
            })
            return prod;

        });

    }

    async findUserPromotionProducts(userRoles: UserRole[]) {

        const promotions = await this.promotionRepo.createQueryBuilder('promo')
            .where('prm_user_type @> ARRAY[:userRoles]::INTEGER[]', { userRoles: userRoles.toString() })
            .where('promo.status = :status', { status: PromotionStatus.ACTIVE })
            .getMany();

        const promoIds = promotions.map(({ id }) => id);

        const products = await this.findAllProductsByPromotionIds(promoIds);

        return products;

    }

    findAllProductsByPromotionIds(promotionIds: number[]): Promise<ProductPromotionEntity[]> {
        return this.productPromotionRepo.find({ promotionId: In(promotionIds) });
    }

    async delete(promotionId: number) {
        await this.productPromotionRepo.delete({ promotionId });
        return await this.promotionRepo.delete({ id: promotionId });
    }

    async update({ products, id, ...body }: UpdatePromotionForm) {

        await this.promotionRepo.update({ id }, body);
        const savedProducts = await this.productPromotionRepo.find({ promotionId: id });

        const result = {
            updated: [],
            saved: {},
            deleted: {},
        };
        const productsToInsert = [];

        for (const { valueCents, ...product } of products) {
            if (savedProducts.some(prod => prod.productId === product.id)) {
                // Updates the product sent
                const updated = await this.productPromotionRepo.update({
                    productId: product.id,
                    promotionId: id,
                }, { valueCents });
                result.updated.push(updated);
            } else {
                productsToInsert.push({
                    valueCents,
                    productId: product.id,
                    promotionId: id,
                });
            }
        }

        // Saves the products sent but not stored
        if (productsToInsert.length) {
            result.saved = await this.productPromotionRepo.createQueryBuilder()
                .insert()
                .values(productsToInsert)
                .execute()
                    .catch(() => {
                        throw new HttpException({
                            code: HttpStatus.NOT_FOUND,
                            message: 'Um dos produtos não foi encontrado.',
                        }, HttpStatus.NOT_FOUND)
                    });
        }

        // Remove the products not sent
        const productsToRemove = savedProducts.filter(savProd => {
            return !products.some(prod => {
                return prod.id === savProd.productId;
            });
        });

        if (productsToRemove.length) {
            const productsIds = productsToRemove.map(prod => prod.productId);
            result.deleted = await this.productPromotionRepo.delete({ productId: In(productsIds), promotionId: id });
        }

        return result;

    }

    activationPromotion({ promotionId, status }: ActivationPromotion) {
        return this.promotionRepo.update({ id: promotionId }, { status });
    }

    async saveImage({ id, imgUrl }: SaveImageForm) {

        const fileUrl = await uploadAmazon.default().uploadImg(imgUrl, `promotion-${id}`);

        await this.promotionRepo.update({ id }, { imgUrl: fileUrl });

        return {
            imgUrl: fileUrl,
        };

    }

    async findAllFilteredAndPaginated({ take, page }: PaginationForm, productFilter: FilterForm[] = []) {

        const skip = skipFromPage(page);
        const builder = this.promotionRepo.createQueryBuilder('promo');

        const [result, count] = await generateQueryFilter({
            like: ['prm_title', 'prm_description'],
            numbers: ['prm_status'],
            numbersArray: ['prm_user_type'],
            dates: ['prm_creation_date'],
            datas: Array.isArray(productFilter) ? productFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('prm_id', 'ASC')
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }

}
