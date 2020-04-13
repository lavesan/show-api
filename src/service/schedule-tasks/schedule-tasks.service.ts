import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { GetnetService } from 'src/services/getnet/getnet.service';
import { OrderToProductService } from 'src/services/order-to-product/order-to-product.service';

@Injectable()
export class ScheduleTasksService {

    private readonly logger = new Logger(ScheduleTasksService.name);

    constructor(
        private readonly getnetService: GetnetService,
        private readonly orderToProductService: OrderToProductService,
    ) {}

    @Interval(1700000)
    async redoGetnetAuthentication() {
        await this.getnetService.writeAuthTokenOnFile();
        this.logger.debug('Autenticação do getnet refeita');
    }

    // @Interval(1800000)
    // deleteAllTrashOrders() {
    //     this.orderToProductService.deleteInvalidOrders()
    //         .then(res => {
    //             // this.logger.debug(`Pedidos excluidos: ${JSON.stringify(res)}`);
    //         })
    //         .catch(err => {
    //             this.logger.debug(`Erro: ${JSON.stringify(err)}`);
    //         });
    // }

}
