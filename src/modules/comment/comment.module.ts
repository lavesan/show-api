import { Module } from '@nestjs/common';
import { CommentController } from 'src/controllers/all/comment/comment.controller';
import { CommentService } from 'src/services/comment/comment.service';

@Module({
  imports: [CommentModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
