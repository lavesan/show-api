import { PromotionStatus } from "src/model/constants/promotion.constants";
import { IsEnum, IsNumber } from "class-validator";

export class ActivationPromotion{

    @IsNumber()
    promotionId: number;

    @IsEnum(PromotionStatus)
    status: PromotionStatus;

}