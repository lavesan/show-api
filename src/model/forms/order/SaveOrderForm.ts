import { OrderStatus, OrderType } from "src/model/constants/order.constants";
import { ProductInfoForm } from "../product/ProductInfoForm";
import { IsEnum, IsNumberString, IsOptional, IsNotEmpty } from "class-validator";

export class SaveOrderForm {

    cardCode: string;

    @IsEnum(OrderType)
    type: OrderType;

    @IsNumberString()
    totalValueCents: string;

    @IsNumberString()
    totalProductValueCents: string;

    @IsNumberString()
    totalFreightValuesCents: string;

    @IsNumberString()
    @IsOptional()
    changeValueCents: string;

    getOnMarket: boolean;

    @IsNotEmpty()
    receiveDate: Date;

    @IsNotEmpty()
    products: ProductInfoForm[];

}