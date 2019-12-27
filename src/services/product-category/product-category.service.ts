import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/entities/productCategory.entity';
import { Repository } from 'typeorm';
import { SaveCategoryForm } from 'src/model/forms/product-category/SaveCategoryForm';

@Injectable()
export class ProductCategoryService {

    constructor(
        @InjectRepository(ProductCategoryEntity)
        private readonly productCategoryRepo: Repository<ProductCategoryEntity>,
    ) {}

    async save({ subCategoryId, ...saveCategoryForm }: SaveCategoryForm) {
        const subCategory = subCategoryId ?
            await this.findOneByIdOrFail(subCategoryId) :
            null;

        const data = {
            ...saveCategoryForm,
            subCategoryId: subCategory ? subCategoryId : null,
            creationDate: new Date(),
        };

        return await this.productCategoryRepo.save(data);
    }

    async findOneByIdOrFail(categoryId: number) {
        return this.productCategoryRepo.findOneOrFail({ id: categoryId });
    }

    async findAllCategoriesTree() {

        const allFathersArr = await this.findAllFathers();
        return await this.mapAllFathers(allFathersArr);

    }

    /**
     * @description Recursive function to load tree of categories
     * @param {ProductCategoryEntity[]} param0
     */
    private async mapAllFathers([father, ...fathers]: ProductCategoryEntity[]) {

        if (!father) {
            return [];
        }

        const childrens = await this.findAllWithFatherId(father.id);

        return [
            {
                id: father.id,
                name: father.name,
                childrens: await this.mapAllFathers(childrens),
            },
            ...(await this.mapAllFathers(fathers)),
        ];

    }

    async findById(categoryId: number) {
        return this.productCategoryRepo.findOne({ id: categoryId });
    }

    private async findAllFathers() {
        return this.productCategoryRepo.find({ subCategoryId: null });
    }

    private async findAllWithFatherId(findAllWithFatherId: number) {
        return this.productCategoryRepo.find({ subCategoryId: findAllWithFatherId });
    }

    /**
     * @description Coleta toda a árvore de uma categoria
     * @param {number} categoryId
     */
    async findProductCategoryTree(categoryId: number) {
        let category = await this.findById(categoryId);

        const categoryTreeArr = [];

        while (category) {

            categoryTreeArr.push(category);

            if (category.subCategoryId) {
                category = await this.findById(category.subCategoryId)
            } else {
                break;
            }

        }

        categoryTreeArr.reverse();

        return this.generateTree(categoryTreeArr);

    }

    private generateTree([data1, ...data]: any[]) {

        if (!data1) {
            return null;
        }

        return {
            name: data1.name,
            subCategory: this.generateTree(data),
        };

    }

}
