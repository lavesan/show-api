import { SaveProductForm } from './SaveProductForm';
import { IsNumber } from 'class-validator';

export class UpdateProductForm extends SaveProductForm {

    @IsNumber()
    id: number;

}