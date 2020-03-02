import { Controller, Put, Body, Post, Query } from '@nestjs/common';
import { CommentService } from 'src/services/comment/comment.service';
import { ActiveCommentForm } from 'src/model/forms/comments/ActiveCommentForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';

@Controller('backoffice/comment')
export class CommentBackofficeController {

    constructor(private readonly commentService: CommentService) {}

    @Put()
    activatePosition(@Body() body: ActiveCommentForm) {
        return this.commentService.activatePosition(body);
    }

    @Post('all')
    findAllFilteredAndPaginated(@Query() paginationForm: PaginationForm, @Body() userFilter: FilterForm[]) {
        return this.commentService.findAllFilteredAndPaginated(paginationForm, userFilter);
    }

}
