import { IsNumberString, IsOptional, IsString, IsNumber } from 'class-validator';

export class SaveAddressForm {

    @IsNumber()
    userId: number;

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

}