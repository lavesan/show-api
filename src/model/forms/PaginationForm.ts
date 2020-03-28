import { IsNumberString, IsOptional } from "class-validator";

export class PaginationForm {

    @IsNumberString()
    @IsOptional()
    take: number;

    @IsNumberString()
    @IsOptional()
    page: number;

}