import { OrderType } from 'src/model/constants/order.constants';
import { ProductInfoForm } from '../product/ProductInfoForm';
import { IsEnum, IsNumberString, IsOptional, IsString, IsBoolean, IsArray, IsObject } from 'class-validator';
import { SaveScheduledTimeForm } from '../scheduled-time/SaveScheduledTimeForm';
import { ComboInfoForm } from '../combo/ComboInfoForm';
import { SaveAddressToOrderForm } from '../address/SaveAddressToOrderForm';
import { SaveContactToOrderForm } from '../contact/SaveContactToOrderForm';

export class SaveOrderForm {

    @IsEnum(OrderType)
    type: OrderType;

    @IsNumberString()
    @IsOptional()
    changeValueCents: string;

    @IsBoolean()
    @IsOptional()
    getOnMarket: boolean;

    @IsArray()
    @IsOptional()
    products: ProductInfoForm[];

    @IsArray()
    @IsOptional()
    combos: ComboInfoForm[];

    @IsObject()
    @IsOptional()
    receive: SaveScheduledTimeForm;

    @IsString()
    @IsOptional()
    description: string;

    @IsObject()
    @IsOptional()
    address: SaveAddressToOrderForm;

    @IsObject()
    @IsOptional()
    contact: SaveContactToOrderForm;

}
