import { Controller, Get, Headers } from '@nestjs/common';
import { PromotionService } from 'src/services/promotion/promotion.service';

@Controller('promotion')
export class PromotionController {

    constructor(private readonly promotionService: PromotionService) {}

    @Get('all')
    findAllFromUser(@Headers('authorization') token: string) {
        return this.promotionService.findPromotionsFromUser(token);
    }

}
