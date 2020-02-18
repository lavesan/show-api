import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductComboEntity } from 'src/entities/product-combo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductComboService {

    constructor(
        @InjectRepository(ProductComboEntity)
        private readonly productComboRepo: Repository<ProductComboEntity>,
    ) {}

}
