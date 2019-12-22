import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { ProductType, ProductStatus } from 'src/model/constants/product.constants';

export class SaveProductForm {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    imgUrl: string;

    @IsNotEmpty()
    type: ProductType;

    @IsNotEmpty()
    status: ProductStatus;

    @IsNumberString()
    actualValueCents: string;

    @IsNumberString()
    @IsOptional()
    lastValueCents: string;

    description: string;

}