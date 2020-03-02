import { IsEnum, IsNumber, IsString, Matches, IsOptional, IsBoolean } from 'class-validator';
import { UserRole, UserGender } from '../../../model/constants/user.constants';
import { emailRegex } from '../../../helpers/validate.helpers';

export class RegisterUserForm {

    @Matches(emailRegex)
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

}