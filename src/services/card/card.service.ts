import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'src/entities/card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(CardEntity)
        private readonly cardRepo: Repository<CardEntity>,
    ) {}

    async saveOne(card): Promise<any> {
        return await this.cardRepo.save(card);
    }

    async updateOne(card): Promise<any> {
        return await this.cardRepo.update({ id: card.id }, card);
    }
}
