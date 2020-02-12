import { Controller, Get } from '@nestjs/common';
import { CommentService } from 'src/services/comment/comment.service';

@Controller('comment')
export class CommentController {

    constructor(private readonly commentService: CommentService) {}

    @Get('all')
    findAllActivesORdered() {
        return this.commentService.findActivesOrdered();
    }

}
