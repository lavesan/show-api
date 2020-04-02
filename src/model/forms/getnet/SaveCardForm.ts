import { IsString, Length, MinLength, MaxLength, IsEnum, IsNumber, IsOptional, Matches } from "class-validator";
import { CardBrand } from "src/model/constants/getnet.constants";
import { cpfCnpjRegex } from "src/helpers/validate.helpers";

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
    number: string;

    @Matches(cpfCnpjRegex)
    @IsOptional()
    legalDocument: string;

}