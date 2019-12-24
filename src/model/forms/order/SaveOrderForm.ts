import { OrderType } from 'src/model/constants/order.constants';
import { ProductInfoForm } from '../product/ProductInfoForm';
import { IsEnum, IsNumberString, IsOptional, IsString, IsBoolean, IsDate, IsArray } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';

export class SaveOrderForm {

    @IsString()
    @IsOptional()
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

    @IsBoolean()
    @IsOptional()
    getOnMarket: boolean;

    @IsDate()
    receiveDate: Date;

    @IsArray()
    products: ProductInfoForm[];

    user: UserEntity;

}
