import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepo: Repository<CommentEntity>,
    ) {}

    saveOne({ productId, userId, briefComment }: SaveCommentForm) {

        const data = {
            briefComment,
            user: { id:  userId },
            product: { id:  productId },
            creationDate: new Date(),
            activePlane: null,
        }

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
        console.log('data: ', data);
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
        const builder = this.commentRepo.createQueryBuilder();

        const [result, count] = await generateQueryFilter({
            like: ['com_brief_comment'],
            numbers: ['com_active_place'],
            equalStrings: ['com_stars'],
            datas: Array.isArray(userFilter) ? userFilter : [],
            builder,
        })
            .skip(skip)
            .limit(take)
            .getManyAndCount();

        return paginateResponseSchema({ data: result, allResultsCount: count, page, limit: take });

    }
}
