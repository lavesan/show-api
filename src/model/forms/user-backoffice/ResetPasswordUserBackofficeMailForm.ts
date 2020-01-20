import { IsEmail } from "class-validator";

export class ResetPasswordUserBackofficeMailForm {

    @IsEmail()
    email: string;

}