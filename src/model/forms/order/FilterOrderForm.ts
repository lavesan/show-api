import { OrderType, OrderStatus } from "src/model/constants/order.constants";

export class FilterOrderForm {

    type: OrderType;

    status: OrderStatus;

    totalValueCents: string;

    totalProductValueCents: string;

    totalFreightValuesCents: string;

    getOnMarket: boolean;

    changeValueCents: string;

    receiveDate: Date;

}