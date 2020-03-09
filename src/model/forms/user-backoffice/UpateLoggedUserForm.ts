import { UserBackofficeRole, UserBackofficeStatus } from "src/model/constants/user-backoffice.constants";
import { IsEnum, IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateLoggedUserForm {

    @IsNumber()
    id: number;

    @IsEnum(UserBackofficeStatus)
    @IsOptional()
    status: UserBackofficeStatus;

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    confirmPassword: string;

    @IsEnum(UserBackofficeRole)
    role: UserBackofficeRole;

    @IsString()
    @IsOptional()
    imgUrl: string;

}