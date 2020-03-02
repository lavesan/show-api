import { IsNumber, IsOptional } from "class-validator";

export class ActiveCommentForm {

    @IsNumber()
    commentId: number;

    @IsNumber()
    @IsOptional()
    activePlace: number;

}