import { IsNumber, IsOptional, IsString } from "class-validator";

export class SaveCategoryForm {

    @IsString()
    name: string;

    @IsNumber()
    @IsOptional()
    subCategoryId: number;

}