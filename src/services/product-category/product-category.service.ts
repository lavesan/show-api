import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/entities/productCategory.entity';
import { Repository } from 'typeorm';
import { SaveCategoryForm } from 'src/model/forms/product-category/SaveCategoryForm';
import { UpdateCategoryForm } from 'src/model/forms/product-category/UpdateCategoryForm';
import { ProductService } from '../product/product.service';

@Injectable()
export class ProductCategoryService {

    constructor(
        @InjectRepository(ProductCategoryEntity)
        private readonly productCategoryRepo: Repository<ProductCategoryEntity>,
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,
    ) {}

    async save({ subCategoryOfId, ...saveCategoryForm }: SaveCategoryForm) {

        const subCategoryOf = subCategoryOfId ?
            await this.findById(subCategoryOfId) :
            null;

        if (subCategoryOf && !subCategoryOf) {
            throw new HttpException({
                code: HttpStatus.NOT_FOUND,
                message: 'Subcategoria não encontrada',
            }, HttpStatus.NOT_FOUND);
        };

        const data = {
            ...saveCategoryForm,
            subCategoryOfId: subCategoryOf ? subCategoryOfId : null,
            creationDate: new Date(),
        };

        return await this.productCategoryRepo.save(data);

    }

    async findOneByIdOrFail(categoryId: number) {
        return this.productCategoryRepo.findOneOrFail({ id: categoryId });
    }

    async findById(categoryId: number) {
        return this.productCategoryRepo.findOne({ id: categoryId });
    }

    async update({ id, ...updateCategoryForm }: UpdateCategoryForm) {
        return this.productCategoryRepo.update({ id }, updateCategoryForm);
    }

    async findOneWithFather(categoryId: number) {

        const category = await this.findById(categoryId);

        if (category) {

            let father = null;
            if (category.subCategoryOfId) {
                father = await this.findById(category.subCategoryOfId);
            }

            return {
                id: category.id,
                name: category.name,
                father: father ?
                    { id: father.id, name: father.name } :
                    null,
            }

        }

    }

    async deleteOneCategory(categoryId: number) {

        const categories = await this.findAllWithFatherId(categoryId);

        if (categories.length) {

            throw new HttpException({
                message: 'Existem subcategorias desta categoria. Exclua elas se quiser remover esta categoria.',
                status: HttpStatus.FORBIDDEN,
            }, HttpStatus.FORBIDDEN);

        }

        const products = await this.productService.findAllByCategoryId(categoryId);

        if (products.length) {

            throw new HttpException({
                message: 'Existem produtos com esta categoria, altere-os para outra categoria antes.',
                status: HttpStatus.FORBIDDEN,
            }, HttpStatus.FORBIDDEN);

        }

        return this.delete(categoryId);

    }

    private async delete(categoryId: number) {
        return this.productCategoryRepo.delete({ id: categoryId });
    }

    async findAllCategoriesFiltered(name: string) {
        const where: any = {};

        if (name) {
            where.name = name;
        }

        return this.productCategoryRepo.find({
            select: ['name', 'id'],
            where,
        });
    }

    async findAllCategoriesTree() {

        const allFathersArr = await this.findAllFathers();
        return await this.mapAllFathers(allFathersArr);

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

            if (category.subCategoryOfId) {
                category = await this.findById(category.subCategoryOfId)
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

    private async findAllFathers() {
        return this.productCategoryRepo.find({
            where: {
                subCategoryOfId: null,
            },
            order: {
                id: 'ASC',
            }
        });
    }

    private async findAllWithFatherId(findAllWithFatherId: number) {
        return this.productCategoryRepo.find({ subCategoryOfId: findAllWithFatherId });
    }

    findAll() {
        return this.productCategoryRepo.find();
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

}
