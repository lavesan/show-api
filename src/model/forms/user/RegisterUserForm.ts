import { IsEnum, IsNumber, IsString, Matches, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '../../../model/constants/user.constants';
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

    @IsNumber()
    age: number;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    termOfContract: boolean;

    @IsString()
    CLIENT_ID: string;
    
    @IsString()
    CLIENT_SECRET: string;

}