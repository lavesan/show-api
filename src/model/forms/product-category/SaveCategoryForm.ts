import { IsOptional, IsString, IsNumber } from "class-validator";

export class SaveCategoryForm {

    @IsString()
    name: string;

    @IsNumber()
    @IsOptional()
    subCategoryOfId: number;

}