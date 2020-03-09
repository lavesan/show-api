import { IsNumber } from "class-validator";

export class UpdateStockForm {

    @IsNumber()
    id: number;

    @IsNumber()
    quantityOnStock: number;

}