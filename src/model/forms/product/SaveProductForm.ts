import { IsNumberString, IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ProductType, ProductStatus } from 'src/model/constants/product.constants';

export class SaveProductForm {

    @IsString()
    name: string;

    @IsString()
    imgUrl: string;

    @IsEnum(ProductType)
    type: ProductType;

    @IsEnum(ProductStatus)
    status: ProductStatus;

    @IsString()
    quantityPrefix: string;

    @IsNumber()
    @IsOptional()
    quantityOnStock: number;

    @IsNumber()
    categoryId: number;

    @IsNumberString()
    actualValueCents: string;

    @IsNumberString()
    @IsOptional()
    lastValueCents: string;

    @IsString()
    @IsOptional()
    description: string;

}