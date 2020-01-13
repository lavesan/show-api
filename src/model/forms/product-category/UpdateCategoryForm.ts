import { IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateCategoryForm {

    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsNumber()
    @IsOptional()
    subCategoryOfId: number;

}