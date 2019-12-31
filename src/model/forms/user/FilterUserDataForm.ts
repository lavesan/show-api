import { UserStatus, UserRole } from "src/model/constants/user.constants";
import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator";

export class FilterUserDataForm {

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsEnum(UserStatus)
    @IsOptional()
    status: UserStatus;

    @IsNumber()
    @IsOptional()
    age: number;

    @IsEnum(UserStatus)
    @IsOptional()
    role: UserRole;

    @IsString()
    @IsOptional()
    description: string;

}