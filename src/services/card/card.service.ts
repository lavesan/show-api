import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'src/entities/card.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { CardType } from 'src/model/constants/card.constants';

@Injectable()
export class CardService {

    constructor(
        @InjectRepository(CardEntity)
        private readonly cardRepo: Repository<CardEntity>,
    ) {}

    saveOne({ getnetId, ...card }: any): Promise<CardEntity> {

        const lastDigits = card.number.match(/\d{4}$/);

        const formatedLastDigits = `**** **** **** ${lastDigits}`;

        const body = {
            ...card,
            getnetId,
            user: { id: card.userId },
            type: CardType.CREDIT,
            lastDigits: formatedLastDigits,
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

    findOneByUserAndCardId({ cardId, userId }) {
        return this.cardRepo.findOne({ id: cardId, user: { id: userId } });
    }

    deleteByGetnetId(getnetId: string) {
        return this.cardRepo.delete({ getnetId });
    }

}
