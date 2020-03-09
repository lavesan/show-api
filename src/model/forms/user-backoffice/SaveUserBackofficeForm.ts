import { UserBackofficeRole, UserBackofficeStatus } from "src/model/constants/user-backoffice.constants";
import { IsEnum, IsString, IsOptional } from "class-validator";

export class SaveUserBackofficeForm {


    @IsEnum(UserBackofficeStatus)
    status: UserBackofficeStatus;

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