import { IsEnum, IsNumber, IsString, Matches, IsOptional, IsBoolean, IsEmail, IsObject } from 'class-validator';
import { UserRole, UserGender } from '../../../model/constants/user.constants';
import { SaveAddressForm } from '../address/SaveAddressForm';
import { SaveContactForm } from '../contact/SaveContactForm';

export class RegisterUserForm {

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @Matches(/^[A-Z a-z]+$/)
    name: string;

    @IsString()
    imgUrl: string;

    @IsEnum(UserGender)
    gender: UserGender;

    @IsNumber()
    age: number;

    @IsNumber()
    animalsQuantity: number;

    @IsNumber()
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
    contact: SaveContactForm;

}