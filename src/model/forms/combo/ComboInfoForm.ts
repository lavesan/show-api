import { IsNumber } from "class-validator";

export class ComboInfoForm {

    @IsNumber()
    id: number;

    @IsNumber()
    quantity: number;

}