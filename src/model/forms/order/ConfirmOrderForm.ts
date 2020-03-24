import { IsNumber, IsObject, IsOptional } from "class-validator";
import { SaveCardForm } from "../getnet/SaveCardForm";

export class ConfirmOrderForm {

    @IsNumber()
    id: number;

    @IsObject()
    @IsOptional()
    card: SaveCardForm;

}