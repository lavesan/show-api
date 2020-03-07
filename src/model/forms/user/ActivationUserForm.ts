import { IsEnum, IsNumber } from "class-validator";
import { UserStatus } from "src/model/constants/user.constants";

export class ActivationUserForm {

    @IsNumber()
    id: number;

    @IsEnum(UserStatus)
    status: UserStatus;

}