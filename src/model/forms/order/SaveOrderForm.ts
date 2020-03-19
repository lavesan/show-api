import { OrderType } from 'src/model/constants/order.constants';
import { ProductInfoForm } from '../product/ProductInfoForm';
import { IsEnum, IsNumberString, IsOptional, IsString, IsBoolean, IsArray, IsObject } from 'class-validator';
import { SaveScheduledTimeForm } from '../scheduled-time/SaveScheduledTimeForm';
import { SaveCardForm } from '../getnet/SaveCardForm';
import { ComboInfoForm } from '../combo/ComboInfoForm';

export class SaveOrderForm {

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

    @IsArray()
    combos: ComboInfoForm[];

    @IsObject()
    @IsOptional()
    receive: SaveScheduledTimeForm;

    @IsBoolean()
    payed: boolean;

    @IsString()
    @IsOptional()
    description: string;

    @IsObject()
    @IsOptional()
    card: SaveCardForm;

}
