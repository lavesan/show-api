import { OrderType } from 'src/model/constants/order.constants';
import { ProductInfoForm } from '../product/ProductInfoForm';
import { IsEnum, IsNumberString, IsOptional, IsString, IsBoolean, IsArray, IsObject } from 'class-validator';
import { SaveScheduledTimeForm } from '../scheduled-time/SaveScheduledTimeForm';
import { ComboInfoForm } from '../combo/ComboInfoForm';
import { SaveAddressForm } from '../address/SaveAddressForm';

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

    @IsString()
    @IsOptional()
    description: string;

    @IsObject()
    @IsOptional()
    address: SaveAddressForm;

}
