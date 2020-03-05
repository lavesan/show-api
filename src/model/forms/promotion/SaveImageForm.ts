import { IsString, IsNumber } from "class-validator";

export class SaveImageForm {

    @IsNumber()
    promotionId: number;

    @IsString()
    imgUrl: string;

}