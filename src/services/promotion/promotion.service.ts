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

        if (tokenObj) {

            return this.findUserPromotion([UserRole.NENHUM, tokenObj.role]);

        }

    }

    private async findUserPromotion(userRoles: UserRole[]): Promise<any> {

        const promotions = await this.promotionRepo.createQueryBuilder('promo')
            .where('prm_user_type @> ARRAY[:userRoles]::INTEGER[]', { userRoles: userRoles.toString() })
            .getMany();

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

    async findUserPromotionProducts(userRoles: UserRole[]) {

        const promotions = await this.promotionRepo.createQueryBuilder('promo')
            .where('prm_user_type @> ARRAY[:userRoles]::INTEGER[]', { userRoles: userRoles.toString() })
            .getMany();

        const promoIds = promotions.map(({ id }) => id);

        const products = await this.findAllProductsByPromotionIds(promoIds);

        return products;

    }

    private findAllProductsByPromotionIds(promotionIds: number[]): Promise<ProductPromotionEntity[]> {
        return this.productPromotionRepo.find({ promotionId: In(promotionIds) });
    }

    async delete(promotionId: number) {
        await this.productPromotionRepo.delete({ promotionId });
        return await this.promotionRepo.delete({ id: promotionId });
    }

    async update({ products, id, ...body }: UpdatePromotionForm) {

        await this.promotionRepo.update({ id }, body);

        const updatedValues = [];

        for (const { valueCents, ...product } of products) {
            const updated = await this.productPromotionRepo.createQueryBuilder()
                // .update(User)
                .update()
                .set({ valueCents })
                .where("promotionId = :id", { id })
                .where("pmo_pro_id = :productId", { productId: product.id })
                .execute();
            updatedValues.push(updated);
        }

        return updatedValues;

    }

    activationPromotion({ promotionId, status }: ActivationPromotion) {
        return this.promotionRepo.update({ id: promotionId }, { status });
    }

    saveImage({ promotionId, imgUrl }: SaveImageForm) {
        return this.promotionRepo.update({ id: promotionId }, { imgUrl });
    }

}
