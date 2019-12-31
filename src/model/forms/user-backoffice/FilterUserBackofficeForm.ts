import { UserBackofficeRole } from "src/model/constants/userBackoffice.constants";
import { IsString, IsOptional, IsEnum } from "class-validator";

export class FilterUserBackofficeForm {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsEnum(UserBackofficeRole)
    @IsOptional()
    role: UserBackofficeRole;

}