import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { Repository, UpdateResult } from 'typeorm';
import { SaveCommentForm } from 'src/model/forms/comments/SaveCommentForm';
import { ActiveCommentForm } from 'src/model/forms/comments/ActiveCommentForm';
import { ChangeCommentForm } from 'src/model/forms/comments/ChangeCommentForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { skipFromPage, generateQueryFilter, paginateResponseSchema } from 'src/helpers/response-schema.helpers';
import { removePwd } from 'src/helpers/user.helpers';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepo: Repository<CommentEntity>,
        private readonly userService: UserService,
    ) {}

    async saveOne({ productId, userId, briefComment }: SaveCommentForm) {

        const user = await this.userService.findById(userId);

        if (!user) {
            throw new HttpException({
                code: HttpStatus.NOT_FOUND,
                message: 'Usuário não encontrado',
            }, HttpStatus.NOT_FOUND);
        }

        const data = {
            briefComment,
            user: { id:  userId },
            product: { id:  productId },
            creationDate: new Date(),
            activePlane: null,
        };

        return this.commentRepo.save(data);

    }

    updateComment({ briefComment, commentId }: ChangeCommentForm): Promise<UpdateResult> {

        const data = {
            briefComment,
            updateDate: new Date(),
        };

        return this.commentRepo.update({ id: commentId }, data);

    }

    activatePosition({ commentId, activePlace }: ActiveCommentForm): Promise<UpdateResult> {

        const data = {
            activePlace,
            updateDate: new Date(),
        };
        return this.commentRepo.update({ id: commentId }, data);

    }

    async findActivesOrdered() {

        let comments = await this.commentRepo.find();

        comments = comments.filter(({ activePlace }) => activePlace);
        comments = comments.map(comment => ({
            ...comment,
            user: comment.user ? removePwd(comment.user) : comment.user,
        }))

        const compare = (a: CommentEntity, b: CommentEntity) => {
            if (a.activePlace < b.activePlace) {
                return -1;
            }
            if (a.activePlace > b.activePlace) {
                return 1;
            }
            // são idênticos
            return 0;
        }

        const sortedComments = comments.sort(compare);

        return sortedComments;

    }

    async findAllFilteredAndPaginated({ take, page }: PaginationForm, userFilter: FilterForm[]): Promise<any> {

        const skip = skipFromPage(page);
        const builder = this.commentRepo.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')

        const [result, count] = await generateQueryFilter({
            like: ['com_brief_comment', 'user.name'],
            numbers: ['com_active_place'],
            datas: Array.isArray(userFilter) ? userFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .orderBy('com_active_place', 'ASC')
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }
}
