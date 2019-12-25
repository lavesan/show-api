import { ProductType, ProductStatus, ProductCategory } from "src/model/constants/product.constants";
import { IsString, IsOptional, IsEnum } from "class-validator";

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

    @IsEnum(ProductCategory)
    @IsOptional()
    category: ProductCategory;

    @IsString()
    @IsOptional()
    actualValueCents: string;

}