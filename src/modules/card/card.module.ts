import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardService } from 'src/services/card/card.service';
import { CardEntity } from '../../entities/card.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([CardEntity]),
      CardModule,
    ],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule {}
