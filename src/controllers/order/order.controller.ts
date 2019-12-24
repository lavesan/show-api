import { Controller, Post, Body, Headers, Put } from '@nestjs/common';
import { SaveOrderForm } from 'src/model/forms/order/SaveOrderForm';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';
import { OrderService } from 'src/services/order/order.service';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderToProductService: OrderToProductService,
        private readonly orderService: OrderService,
    ) {}

    @Post()
    saveOrder(@Body() body: SaveOrderForm, @Headers('authorization') token: string) {
        return this.orderToProductService.save(body, token);
    }

    @Put()
    updateStatusOrder(@Body() body: UpdateStatusOrderForm) {
        return this.orderService.update(body);
    }
}
