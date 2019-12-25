import { IsNumberString, IsOptional, IsString, IsEnum } from 'class-validator';
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

    @IsNumberString()
    actualValueCents: string;

    @IsNumberString()
    @IsOptional()
    lastValueCents: string;

    @IsString()
    @IsOptional()
    description: string;

}