import { Controller, Post, Query, Body, Headers, Put, Param, Delete } from '@nestjs/common';
import { OrderService } from 'src/services/order/order.service';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { FilterForm } from 'src/model/forms/FilterForm';
import { UpdateStatusOrderForm } from 'src/model/forms/order/UpdateStatusOrderForm';

@Controller('backoffice/order-backoffice')
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

    @Delete(':id')
    deleteOne(@Param('id') orderId: number) {
        return this.orderService.deleteOne(orderId);
    }

}
