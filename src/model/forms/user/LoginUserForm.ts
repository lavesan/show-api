import { IsNotEmpty } from 'class-validator';

export class LoginUserForm {

    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    password: string;
}