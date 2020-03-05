import { IsNumber } from "class-validator";
import { SavePromotionForm } from "./SavePromotionForm";

export class UpdatePromotionForm extends SavePromotionForm {

    @IsNumber()
    id: number;

}