import { IsNumber } from "class-validator";
import { SaveCategoryForm } from "./SaveCategoryForm";

export class UpdateCategoryForm extends SaveCategoryForm {

    @IsNumber()
    id: number;

}