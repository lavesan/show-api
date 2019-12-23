import { IsNumber } from 'class-validator';
import { SaveAddressForm } from './SaveAddressForm';

export class UpdateAddressForm extends SaveAddressForm {

    @IsNumber()
    id: number;

}