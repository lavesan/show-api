import { Module } from '@nestjs/common';
import { CommentController } from 'src/controllers/all/comment/comment.controller';
import { CommentService } from 'src/services/comment/comment.service';
import { CommentBackofficeController } from 'src/controllers/backoffice/comment-backoffice/comment-backoffice.controller';
import { CommentClientController } from 'src/controllers/client/comment-client/comment-client.controller';
import { CommentEntity } from 'src/entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    CommentModule,
    UserModule,
  ],
  controllers: [
    CommentController,
    CommentBackofficeController,
    CommentClientController,
  ],
  providers: [CommentService],
})
export class CommentModule {}
