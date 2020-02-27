import { Module } from '@nestjs/common';
import { ScheduleTasksService } from 'src/service/schedule-tasks/schedule-tasks.service';
import { GetnetModule } from '../getnet/getnet.module';

@Module({
    imports: [GetnetModule],
    providers: [ScheduleTasksService],
})
export class ScheduleTasksModule {}
