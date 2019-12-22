import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([ProductEntity]),
      ProductModule,
    ],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
