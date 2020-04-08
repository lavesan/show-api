import { IsNumber, IsObject, IsOptional, IsBoolean, IsString } from "class-validator";
import { SaveCardForm } from "../getnet/SaveCardForm";

export class ConfirmOrderForm {

    @IsNumber()
    id: number;

    @IsBoolean()
    saveCard: boolean;

    @IsString()
    @IsOptional()
    card: string;

}