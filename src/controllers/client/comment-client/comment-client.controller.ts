import { Controller, Post, Body, Put } from '@nestjs/common';
import { CommentService } from 'src/services/comment/comment.service';
import { SaveCommentForm } from 'src/model/forms/comments/SaveCommentForm';
import { ChangeCommentForm } from 'src/model/forms/comments/ChangeCommentForm';

@Controller('client/comment')
export class CommentClientController {

    constructor(private readonly commentService: CommentService) {}

    @Post()
    saveOne(@Body() body: SaveCommentForm) {
        return this.commentService.saveOne(body);
    }

    @Put()
    changeComment(@Body() body: ChangeCommentForm) {
        return this.commentService.updateComment(body);
    }

}
