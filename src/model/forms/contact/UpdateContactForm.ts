import { SaveContactForm } from "./SaveContactForm";
import { IsNumber } from "class-validator";

export class UpdateContactForm extends SaveContactForm {

    @IsNumber()
    contactId: number;

}