import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { SaveProductForm } from 'src/model/forms/product/SaveProductForm';
import { UpdateProductForm } from 'src/model/forms/product/UpdateProductForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, paginateResponseSchema } from 'src/utils/response-schema.utils';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
    ) {}

    // TODO: Adicionar usuário backoffice que o criou
    async saveMany(products: SaveProductForm[]): Promise<any> {
        for (const product of products) {
            const data = {
                ...product,
                creationDate: new Date(),
            };

            await this.productRepo.save(data);
        }
        return { code: 1, message: 'Produtos salvos' };
    }

    // TODO: Adicionar usuário backoffice que o alterou
    async updateOne(product: UpdateProductForm): Promise<UpdateResult> {
        const data = {
            ...product,
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
    async findAllFilteredPaginate({ take, page }: PaginationForm): Promise<any> {
        const skip = skipFromPage(page);
        const [products, allResultsCount] = await this.productRepo.findAndCount({
            take,
            skip,
        });

        return paginateResponseSchema({ data: products, allResultsCount, page });
    }

}
