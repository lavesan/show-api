import { IsNumber, IsObject, IsOptional, IsBoolean } from "class-validator";
import { SaveCardForm } from "../getnet/SaveCardForm";

export class ConfirmOrderForm {

    @IsNumber()
    id: number;

    @IsBoolean()
    saveCard: boolean;

    @IsObject()
    @IsOptional()
    card: SaveCardForm;

}