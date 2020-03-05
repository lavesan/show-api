import { Controller, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PromotionService } from 'src/services/promotion/promotion.service';
import { SavePromotionForm } from 'src/model/forms/promotion/SavePromotionForm';
import { UpdatePromotionForm } from 'src/model/forms/promotion/UpdatePromotionForm';
import { ActivationPromotion } from 'src/model/forms/promotion/ActivationPromotion';
import { SaveImageForm } from 'src/model/forms/promotion/SaveImageForm';

@Controller('backoffice/promotion')
export class PromotionBackofficeController {

    constructor(private readonly promotionService: PromotionService) {}

    @Post()
    saveOne(@Body() body: SavePromotionForm) {
        return this.promotionService.save(body);
    }

    @Post('image')
    saveImage(@Body() body: SaveImageForm) {
        return this.promotionService.saveImage(body);
    }

    @Put()
    updateOne(@Body() body: UpdatePromotionForm) {
        return this.promotionService.update(body);
    }

    @Delete(':id')
    deleteOne(@Param('id') promotionId: number) {
        return this.promotionService.delete(promotionId);
    }

    @Put('activate')
    activate(@Body() body: ActivationPromotion) {
        return this.promotionService.activationPromotion(body);
    }

}
