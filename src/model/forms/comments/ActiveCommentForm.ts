import { IsNumber } from "class-validator";

export class ActiveCommentForm {

    @IsNumber()
    commentId: number;

    @IsNumber()
    activePlace: number;

}