import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledTimeEntity } from 'src/entities/scheduled-time.entity';
import { ScheduledTimeService } from 'src/service/scheduled-time/scheduled-time.service';
import { ScheduledTimeController } from 'src/controllers/all/scheduled-time/scheduled-time.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([ScheduledTimeEntity]),
      ScheduledTimeModule,
    ],
    controllers: [ScheduledTimeController],
    providers: [ScheduledTimeService],
    exports: [ScheduledTimeService],
})
export class ScheduledTimeModule {}
