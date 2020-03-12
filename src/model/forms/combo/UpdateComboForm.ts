import { IsNumber } from "class-validator";
import { SaveComboForm } from "./SaveComboForm";

export class UpdateComboForm extends SaveComboForm {

    @IsNumber()
    comboId: number;

}