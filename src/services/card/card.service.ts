import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'src/entities/card.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class CardService {

    constructor(
        @InjectRepository(CardEntity)
        private readonly cardRepo: Repository<CardEntity>,
    ) {}

    saveOne(card): Promise<CardEntity> {

        const body = {
            ...card,
            user: { id: card.userId },
            creationDate: new Date(),
        };

        return this.cardRepo.save(body);

    }

    updateOne(card): Promise<UpdateResult> {

        const body = {
            ...card,
            updateDate: new Date(),
        };

        return this.cardRepo.update({ id: card.id }, body);

    }

    deleteById(cardId: number): Promise<DeleteResult> {
        return this.cardRepo.delete({ id: cardId });
    }

    findAllByUserId(userId: number) {
        return this.cardRepo.find({ user: { id: userId } });
    }

}
