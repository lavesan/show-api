import { Controller, Post, Query, Body, Put, Get } from '@nestjs/common';
import { OrderService } from 'src/services/order/order.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';
import { CancelOrderForm } from 'src/model/forms/order/CancelOrderForm';

@Controller('backoffice/order')
export class OrderBackofficeController {

    constructor(private readonly orderService: OrderService) {}

    // TODO: Adicionar parâmetros que faltam no objeto de resposta
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
        return this.orderService.findUserStatistic(userId);
    }

}
