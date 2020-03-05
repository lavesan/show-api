import { IsNumber, IsString } from "class-validator";

export class SaveProductPromotionForm {

    @IsNumber()
    id: number;

    @IsString()
    valueCents: string;

}