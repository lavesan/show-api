import { UserRole } from "src/model/constants/user.constants";
import { IsEnum, IsNumber } from "class-validator";

export class ChangeUserRoleForm {

    @IsNumber()
    id: number;

    @IsEnum(UserRole)
    role: UserRole;

}