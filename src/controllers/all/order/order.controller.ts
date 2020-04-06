import { Controller, Post, Body, Headers, Put, Get, Query, Param } from '@nestjs/common';
import { SaveOrderForm } from 'src/model/forms/order/SaveOrderForm';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';
import { OrderService } from 'src/services/order/order.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { IPaginateResponseType } from 'src/helpers/response-schema.helpers';
import { FilterForm } from 'src/model/forms/FilterForm';
import { CancelOrderForm } from 'src/model/forms/order/CancelOrderForm';
import { ConfirmOrderForm } from 'src/model/forms/order/ConfirmOrderForm';
import { GetnetService } from 'src/services/getnet/getnet.service';

@Controller('order')
export class OrderController {

    constructor(
        private readonly orderToProductService: OrderToProductService,
        private readonly orderService: OrderService,
        private readonly getnetService: GetnetService,
    ) {}

    @Post()
    saveOrder(@Body() body: SaveOrderForm, @Headers('authorization') token: string) {
        return this.orderToProductService.save(body, token);
    }

    @Put('confirm')
    confirmOrder(@Body() body: ConfirmOrderForm) {
        return this.orderToProductService.confirmOrder(body);
    }

    // Route to the bank sends the sell status when it's finished, if that's ok, i save as OK
    @Post('finalize-debit')
    finalizeDebitPayment(@Body() body: any) {
        return this.orderToProductService.finalizeDebitPayment(body);
    }

    // Route to the cliente to check if the payment is done
    @Get('payment/check-debit')
    checkDebit(@Query('id') id: number) {
        return this.orderToProductService.checkDebit(id);
    }

    @Put('cancel')
    cancelOrder(@Body() body: CancelOrderForm) {
        return this.orderService.clientCancelOrder(body);
    }

    @Get('all/:id')
    findAllOfClient(
        @Param('id') id: number,
        @Query() paginationForm: PaginationForm,
        @Body() filter: FilterForm[],
    ): Promise<IPaginateResponseType<any>> {
        return this.orderService.findAllWithToken({
            paginationForm,
            filter,
            id,
        });
    }

    @Get()
    findOne(@Query('id') id: number) {
        return this.orderToProductService.findOneData(id);
    }

    @Get('active-schedule')
    getFreeForScheduleDates(@Query('date') date: string) {
        return this.orderService.findActiveDates(date);
    }

    @Post('all/ids')
    findAllActiveByIds(@Body() orderIds: number[]) {
        return this.orderToProductService.findAllActiveOrdersByIds(orderIds);
    }

    @Post('reauthenticate/getnet')
    reauthenticateGetnet(): any {
        return this.getnetService.writeAuthTokenOnFile();
    }

    @Get('delete')
    deleteORder() {
        return this.orderToProductService.deleteInvalidOrders();
    }

}
