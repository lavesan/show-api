import { ContactType } from "src/model/constants/contact.constants";
import { IsEnum, IsString, IsNumber } from "class-validator";

export class SaveContactForm {

    @IsNumber()
    userId?: number;

    @IsString()
    number: string;

    @IsString()
    ddd: string;

    @IsEnum(ContactType)
    type: ContactType;

}