import { SaveUserBackofficeForm } from "./SaveUserBackofficeForm";
import { IsNumber } from "class-validator";

export class UpdateUserBackofficeForm extends SaveUserBackofficeForm {

    @IsNumber()
    id: number;

}