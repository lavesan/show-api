import { IsEmail } from "class-validator";

export class ForgotPasswordForm {

    @IsEmail()
    email: string;

}