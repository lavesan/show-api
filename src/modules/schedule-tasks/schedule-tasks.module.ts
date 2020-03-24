import { Module } from '@nestjs/common';
import { ScheduleTasksService } from 'src/service/schedule-tasks/schedule-tasks.service';
import { GetnetModule } from '../getnet/getnet.module';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [
        GetnetModule,
        OrderModule,
    ],
    providers: [ScheduleTasksService],
})
export class ScheduleTasksModule {}
