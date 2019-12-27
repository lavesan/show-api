import { ProductType, ProductStatus } from "src/model/constants/product.constants";
import { IsString, IsOptional, IsEnum, IsNumber } from "class-validator";

export class FilterProductForm {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(ProductType)
    @IsOptional()
    type: ProductType;

    @IsEnum(ProductStatus)
    @IsOptional()
    status: ProductStatus;

    @IsNumber()
    @IsOptional()
    category: number;

    @IsString()
    @IsOptional()
    actualValueCents: string;

}