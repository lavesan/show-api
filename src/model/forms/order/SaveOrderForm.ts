import { OrderType } from 'src/model/constants/order.constants';
import { ProductInfoForm } from '../product/ProductInfoForm';
import { IsEnum, IsNumberString, IsOptional, IsString, IsBoolean, IsArray, IsObject } from 'class-validator';
import { SaveScheduledTimeForm } from '../scheduled-time/SaveScheduledTimeForm';

export class SaveOrderForm {

    @IsString()
    @IsOptional()
    cardCode: string;

    @IsEnum(OrderType)
    type: OrderType;

    @IsNumberString()
    totalFreightValuesCents: string;

    @IsNumberString()
    @IsOptional()
    changeValueCents: string;

    @IsBoolean()
    @IsOptional()
    getOnMarket: boolean;

    @IsArray()
    products: ProductInfoForm[];

    @IsObject()
    @IsOptional()
    receiveDate: SaveScheduledTimeForm;

    @IsBoolean()
    payed: boolean;

}
