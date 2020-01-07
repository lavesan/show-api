import { UserBackofficeRole } from "src/model/constants/user-backoffice.constants";
import { IsEnum, IsString, IsOptional } from "class-validator";

export class SaveUserBackofficeForm {

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;

    @IsEnum(UserBackofficeRole)
    role: UserBackofficeRole;

    @IsString()
    @IsOptional()
    imgUrl: string;

}