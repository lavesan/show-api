import { SaveUserBackofficeForm } from "./SaveUserBackofficeForm";
import { IsNumber, IsEnum } from "class-validator";
import { UserBackofficeStatus } from "src/model/constants/user-backoffice.constants";

export class UpdateUserBackofficeForm extends SaveUserBackofficeForm {

    @IsNumber()
    id: number;

    @IsEnum(UserBackofficeStatus)
    status: UserBackofficeStatus;

}