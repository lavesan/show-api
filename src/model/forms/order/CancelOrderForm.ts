import { IsString, IsOptional, IsNumber } from "class-validator";

export class CancelOrderForm {

    @IsNumber()
    orderId: number;

    @IsString()
    @IsOptional()
    reason: string;

}