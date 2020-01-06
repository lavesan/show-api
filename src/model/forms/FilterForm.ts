import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

type FilterType = 'between' | 'moreThan' | 'moreThanOrEqual' | 'lessThan' | 'lessThanOrEqual' | 'all' | 'contains' | 'equals';

export class FilterForm {

    @IsString()
    @IsOptional()
    field: string;

    @IsString()
    @IsOptional()
    type: FilterType;

    @IsNotEmpty()
    value: string | number | boolean | { from: string | number, to: string | number };

}