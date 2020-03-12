import { IsNumber } from "class-validator";

export class ProductComboForm {

    @IsNumber()
    id: number;

    @IsNumber()
    quantity: number;

}