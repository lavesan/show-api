import { ContactType } from "src/model/constants/contact.constants";
import { IsEnum, IsString } from "class-validator";

export class SaveContactForm {

    @IsString()
    number: string;

    @IsString()
    ddd: string;

    @IsEnum(ContactType)
    type: ContactType;

}