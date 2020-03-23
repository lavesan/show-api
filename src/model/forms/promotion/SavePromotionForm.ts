import { PromotionStatus } from "src/model/constants/promotion.constants";
import { IsEnum, IsArray, IsString, IsBoolean, IsOptional } from "class-validator";
import { UserRole } from "src/model/constants/user.constants";
import { SaveProductPromotionForm } from "./SaveProductPromotionForm";

export class SavePromotionForm {

    @IsEnum(PromotionStatus)
    status: PromotionStatus;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsArray()
    userTypes: UserRole[];

    @IsArray()
    products: SaveProductPromotionForm[];

    @IsBoolean()
    @IsOptional()
    isPrincipal: boolean;

}