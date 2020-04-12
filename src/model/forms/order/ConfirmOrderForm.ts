import { IsNumber, IsOptional, IsBoolean, IsString } from "class-validator";

export class ConfirmOrderForm {

    @IsNumber()
    id: number;

    @IsBoolean()
    @IsOptional()
    saveCard: boolean;

    @IsString()
    @IsOptional()
    card: string;

}