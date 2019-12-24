import { IsNumberString } from "class-validator";

export class PaginationForm {

    @IsNumberString()
    take: number;

    @IsNumberString()
    page: number;

}