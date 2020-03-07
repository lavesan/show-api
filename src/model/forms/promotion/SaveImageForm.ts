import { IsString, IsNumber } from "class-validator";

export class SaveImageForm {

    @IsNumber()
    id: number;

    @IsString()
    imgUrl: string;

}