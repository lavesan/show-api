import { IsEnum, IsNumber } from "class-validator";
import { ProductStatus } from "src/model/constants/product.constants";

export class ActivationProduct{

    @IsNumber()
    id: number;

    @IsEnum(ProductStatus)
    status: ProductStatus;

}