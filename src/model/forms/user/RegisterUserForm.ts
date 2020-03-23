import { IsEnum, IsString, Matches, IsOptional, IsBoolean, IsEmail, IsObject, IsNumberString } from 'class-validator';
import { UserRole, UserGender } from '../../../model/constants/user.constants';
import { SaveAddressForm } from '../address/SaveAddressForm';
import { SaveContactForm } from '../contact/SaveContactForm';
import { onlyCharacterRegex } from 'src/helpers/validate.helpers';

export class RegisterUserForm {

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @Matches(onlyCharacterRegex)
    name: string;

    @IsString()
    @IsOptional()
    imgUrl: string;

    @IsEnum(UserGender)
    gender: UserGender;

    @IsNumberString()
    age: number;

    @IsNumberString()
    @IsOptional()
    animalsQuantity: number;

    @IsNumberString()
    @IsOptional()
    childrensQuantity: number;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    termOfContract: boolean;

    @IsObject()
    address: SaveAddressForm;

    @IsObject()
    @IsOptional()
    contact: SaveContactForm;

}