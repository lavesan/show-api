import { IsString, IsNotEmpty } from 'class-validator';

export class FilterForm {

    @IsString()
    field: string;

    @IsNotEmpty()
    value: string | boolean | number;

}