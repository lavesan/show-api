import { IsString, IsEmail } from 'class-validator';

export class LoginUserForm {

    @IsEmail()
    login: string;

    @IsString()
    password: string;

    @IsString()
    CLIENT_ID: string;
    
    @IsString()
    CLIENT_SECRET: string;

}