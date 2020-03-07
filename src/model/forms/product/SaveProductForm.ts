import { IsNumberString, IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ProductStatus } from 'src/model/constants/product.constants';

export class SaveProductForm {

    @IsString()
    name: string;

    @IsString()
    imgUrl: string;

    @IsEnum(ProductStatus)
    status: ProductStatus;

    @IsString()
    quantitySuffix: string;

    @IsNumber()
    @IsOptional()
    quantityOnStock: number;

    @IsNumber()
    categoryId: number;

    @IsNumberString()
    actualValueCents: string;

    @IsString()
    @IsOptional()
    description: string;

}