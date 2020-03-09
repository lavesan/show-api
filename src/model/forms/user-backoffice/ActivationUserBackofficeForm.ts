import { UserBackofficeStatus } from "src/model/constants/user-backoffice.constants";
import { IsEnum, IsNumber } from "class-validator";

export class ActivationUserBackofficeForm {

    @IsNumber()
    id: number;

    @IsEnum(UserBackofficeStatus)
    status: UserBackofficeStatus;

}