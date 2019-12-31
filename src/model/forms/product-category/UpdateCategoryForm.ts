import { SaveCategoryForm } from "./SaveCategoryForm";
import { IsNumber } from "class-validator";

export class UpdateCategoryForm extends SaveCategoryForm {

    @IsNumber()
    id: number;

}