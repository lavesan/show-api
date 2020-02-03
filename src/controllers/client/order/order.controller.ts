import { Controller, Post, Body, Headers, Put, Get, Query } from '@nestjs/common';
import { SaveOrderForm } from 'src/model/forms/order/SaveOrderForm';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';
import { OrderService } from 'src/services/order/order.service';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { IPaginateResponseType } from 'src/helpers/response-schema.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';

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

    @Get('all')
    findAllOfClient(
        @Query() paginationForm: PaginationForm,
        @Body() filter: FilterForm[],
        @Headers('authorization') tokenAuth: string,
    ): Promise<IPaginateResponseType<any>> {
        return this.orderService.findAllWithToken({
            paginationForm,
            tokenAuth,
            filter,
        });
    }
}
