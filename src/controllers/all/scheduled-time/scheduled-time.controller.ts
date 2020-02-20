import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ScheduledTimeService } from 'src/service/scheduled-time/scheduled-time.service';

@Controller('scheduled-time')
export class ScheduledTimeController {

    constructor(private readonly scheduledTimeService: ScheduledTimeService) {}

    @Get('active')
    getFreeForScheduleDates(@Query('date') date: string) {
        return this.scheduledTimeService.findActivesDate(date);
    }

    @Post()
    saveOne(@Body() body) {
        return this.scheduledTimeService.saveOne(body);
    }

}
