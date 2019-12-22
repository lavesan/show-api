import { SaveProductForm } from './SaveProductForm';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductForm extends SaveProductForm {

    @IsNotEmpty()
    id: number;

}