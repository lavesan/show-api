import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

type FilterType = 'between' | 'moreThan' | 'moreThanOrEqual' | 'lessThan' | 'lessThanOrEqual' | 'all';

export class FilterForm {

    @IsString()
    @IsOptional()
    field: string;

    @IsString()
    @IsOptional()
    type: FilterType;

    @IsNotEmpty()
    value: string | number | boolean;

}