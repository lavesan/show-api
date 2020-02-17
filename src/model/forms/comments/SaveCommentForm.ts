import { IsNumber, IsString, MaxLength, IsOptional, Max } from "class-validator";

export class SaveCommentForm {

    @IsNumber()
    userId: number;

    @IsString()
    @MaxLength(200)
    briefComment: string;

    @IsNumber()
    @IsOptional()
    productId: number;

}