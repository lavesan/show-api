import { OrderType } from 'src/model/constants/order.constants';
import { ProductInfoForm } from '../product/ProductInfoForm';
import { IsEnum, IsNumberString, IsOptional, IsString, IsBoolean, IsArray, IsObject, IsNumber } from 'class-validator';
import { SaveScheduledTimeForm } from '../scheduled-time/SaveScheduledTimeForm';
import { ComboInfoForm } from '../combo/ComboInfoForm';
import { SaveAddressToOrderForm } from '../address/SaveAddressToOrderForm';
import { SaveContactToOrderForm } from '../contact/SaveContactToOrderForm';

export class SaveOrderForm {

    @IsNumber()
    @IsOptional()
    id: number;

    @IsEnum(OrderType)
    type: OrderType;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    userName: string;

    @IsNumberString()
    @IsOptional()
    changeValueCents: string;

    @IsString()
    @IsOptional()
    cpf: string;

    @IsObject()
    receive: SaveScheduledTimeForm;

    @IsBoolean()
    payed: boolean;

    @IsBoolean()
    saveAddress: boolean;

    @IsObject()
    @IsOptional()
    address: SaveAddressToOrderForm;

    @IsObject()
    @IsOptional()
    contact: SaveContactToOrderForm;

    @IsArray()
    @IsOptional()
    products: ProductInfoForm[];

    @IsArray()
    @IsOptional()
    combos: ComboInfoForm[];

}
