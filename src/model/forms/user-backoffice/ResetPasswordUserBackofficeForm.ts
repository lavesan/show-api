import { IsString } from "class-validator";

export class ResetPasswordUserBackofficeForm {

    @IsString()
    token: string;

    @IsString()
    newPassword: string;

}