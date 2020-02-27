import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { GetnetService } from 'src/services/getnet/getnet.service';

@Injectable()
export class ScheduleTasksService {

    private readonly logger = new Logger(ScheduleTasksService.name);

    constructor(private readonly getnetService: GetnetService) {}

    @Interval(1700000)
    async handleInterval() {
        await this.getnetService.writeAuthTokenOnFile();
        this.logger.debug('Autenticação do getnet refeita');
    }

}
