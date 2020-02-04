import { IsNumber } from "class-validator";

export class ConfirmEmailForm {

    @IsNumber()
    id: number;

}