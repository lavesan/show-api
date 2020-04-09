import { Controller, Post, Query, Body, Put, Get, Delete, Param } from '@nestjs/common';
import { OrderService } from 'src/services/order/order.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';
import { CancelOrderForm } from 'src/model/forms/order/CancelOrderForm';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';

@Controller('backoffice/order')
export class OrderBackofficeController {

    constructor(
        private readonly orderService: OrderService,
        private readonly orderToProductService: OrderToProductService,
    ) {}

    @Post('all')
    findAllFilteredPaginated(
        @Query() paginationForm: PaginationForm,
        @Body() filter: FilterForm[],
    ) {
        return this.orderService.findAllFilteredPaginated({
            paginationForm,
            filterOpt: filter,
        });
    }

    @Get('all/length')
    findAllLength() {
        return this.orderService.findAllLength();
    }

    @Put()
    updateOne(@Body() body: UpdateStatusOrderForm) {
        return this.orderService.update(body);
    }

    @Put('cancel')
    deleteOne(@Body() body: CancelOrderForm) {
        return this.orderService.softDelete(body);
    }

    @Get('statistic')
    userStatistics(@Query('id') userId: number) {
        return this.orderToProductService.findUserStatistic(userId);
    }

    @Delete('delete/:id')
    deleteORder(@Param() orderId: number) {
        return this.orderToProductService.deleteInvalidOrders(orderId);
    }

}
