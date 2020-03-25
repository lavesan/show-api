import { IsString, IsOptional, IsNumberString, IsNumber } from "class-validator";

export class SaveAddressToOrderForm {

    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    address: string;

    @IsNumberString()
    cep: string;

    @IsNumberString()
    number: string;

    @IsString()
    @IsOptional()
    complement: string;

    @IsString()
    type: string;

    @IsString()
    district: string;

}