import { IsNumber, IsEnum } from "class-validator";
import { ProductComboStatus } from "src/model/constants/product-combo.constants";

export class ActivationComboForm {

    @IsNumber()
    comboId: number;

    @IsEnum(ProductComboStatus)
    status: ProductComboStatus;

}