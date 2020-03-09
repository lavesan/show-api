import { IsNumber, IsEnum, IsString } from "class-validator";
import { UserBackofficeStatus, UserBackofficeRole } from "src/model/constants/user-backoffice.constants";

export class UpdateUserBackofficeForm {

    @IsNumber()
    id: number;

    @IsEnum(UserBackofficeStatus)
    status: UserBackofficeStatus;

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsEnum(UserBackofficeRole)
    role: UserBackofficeRole;

}