import { IsNumber, IsString, MaxLength, IsOptional, Max, MinLength } from "class-validator";

export class SaveCommentForm {

    @IsNumber()
    userId: number;

    @IsString()
    @MinLength(15)
    @MaxLength(50)
    briefComment: string;

    @IsNumber()
    @IsOptional()
    productId: number;

}