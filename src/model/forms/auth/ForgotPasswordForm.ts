import { IsEmail } from "class-validator";
import { CredentialsForm } from "./CredentialsForm";

export class ForgotPasswordForm extends CredentialsForm {

    @IsEmail()
    email: string;

}