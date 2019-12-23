import { IsNumber } from "class-validator";

export class ProductInfoForm {

    @IsNumber()
    quantity: number;

    @IsNumber()
    id: number

}