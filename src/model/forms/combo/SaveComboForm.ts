import { ProductComboForm } from "./ProductComboForm";
import { IsNumberString, IsString, IsArray, IsEnum, IsOptional } from "class-validator";
import { ProductComboStatus } from "src/model/constants/product-combo.constants";

export class SaveComboForm {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    briefDescription: string;

    @IsNumberString()
    totalValue: string;

    @IsNumberString()
    normalValueCents: string;

    @IsEnum(ProductComboStatus)
    status: ProductComboStatus;

    @IsArray()
    products: ProductComboForm[];

}