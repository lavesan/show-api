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

    private async findById(categoryId: number) {
        return this.productCategoryRepo.findOne({ id: categoryId });
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

        const dataTree = this.generateTree(categoryTreeArr);

        return dataTree;

    }

    private generateTree([data1, ...data]: any[]) {

        if (!data1) {
            return null;
        }

        return {
            name: data1.name,
            subCategory: this.generateTree(data),
        }

    }

}
