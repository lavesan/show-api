import { IsString, Length, MinLength, MaxLength, IsEnum, IsNumber, IsOptional } from "class-validator";
import { CardBrand } from "src/model/constants/getnet.constants";

export class SaveCardForm {

    @IsNumber()
    @IsOptional()
    id: number;

    @IsEnum(CardBrand)
    brand: CardBrand;

    @IsString()
    nameOnCard: string;

    @Length(2)
    @IsString()
    expirationMonth: string;

    @Length(2)
    @IsString()
    expirationYear: string;

    @IsString()
    @MinLength(3)
    @MaxLength(4)
    securityCode: string;

    @IsString()
    cardNumber: string;

}