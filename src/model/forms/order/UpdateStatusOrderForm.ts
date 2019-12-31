import { OrderStatus } from "src/model/constants/order.constants";
import { IsEnum, IsNumber } from "class-validator";

export class UpdateStatusOrderForm {

    @IsNumber()
    orderId: number;

    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;

}