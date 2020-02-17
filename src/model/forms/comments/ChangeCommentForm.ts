import { IsString, MaxLength, IsNumber, Max } from "class-validator";

export class ChangeCommentForm {

    @IsNumber()
    commentId: number;

    @IsString()
    @MaxLength(200)
    briefComment: string;

}