import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema, generateFilter } from 'src/utils/response-schema.utils';
import { FilterForm } from 'src/model/forms/FilterForm';
import { ProductCategoryService } from '../product-category/product-category.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
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
    async updateOne({ categoryId, ...product }: UpdateProductForm): Promise<UpdateResult> {

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

    // TODO: Adiciona os filtros de paginação
    async findAllFilteredPaginate({ take, page }: PaginationForm, productFilter: FilterForm[]): Promise<any> {
        // Filters
        const filter = generateFilter({
            like: ['name', 'description', 'actualValueCents'],
            equal: ['status', 'category', 'type'],
            datas: productFilter,
        });

        const skip = skipFromPage(page);
        const [products, allResultsCount] = await this.productRepo.findAndCount({
            where: { ...filter },
            take,
            skip,
        });

        return paginateResponseSchema({ data: products, allResultsCount, page });
    }

}
