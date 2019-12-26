import { IsString, Length, MinLength, MaxLength } from "class-validator";

export class SaveCardForm {

    @IsString()
    brand: 'Mastercard' | 'Visa' | 'Amex' | 'Elo' | 'Hipercard';

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