import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPromotionEntity } from 'src/entities/product-promotion.entity';
import { PromotionEntity } from 'src/entities/promotion.entity';
import { PromotionBackofficeController } from 'src/controllers/backoffice/promotion-backoffice/promotion-backoffice.controller';
import { PromotionService } from 'src/services/promotion/promotion.service';
import { PromotionController } from 'src/controllers/all/promotion/promotion.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([ProductPromotionEntity, PromotionEntity]),
    ],
    controllers: [PromotionBackofficeController, PromotionController],
    providers: [PromotionService],
    exports: [PromotionService],
})
export class PromotionModule {}
