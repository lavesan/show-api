import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ContactType } from 'src/model/constants/contact.constants';

export class SaveContactToOrderForm {

    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    number: string;

    @IsString()
    ddd: string;

    @IsEnum(ContactType)
    type: ContactType;

}