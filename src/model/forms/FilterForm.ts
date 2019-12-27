import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

type FilterType = 'between' | 'moreThan' | 'moreThanOrEqual' | 'lessThan' | 'lessThanOrEqual';

export class FilterForm {

    @IsString()
    @IsOptional()
    field: string;

    @IsString()
    type: FilterType;

    @IsNotEmpty()
    value: string | number | boolean;

}