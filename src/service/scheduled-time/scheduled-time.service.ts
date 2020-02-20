import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduledTimeEntity } from 'src/entities/scheduled-time.entity';
import { Repository, DeleteResult } from 'typeorm';
import * as moment from 'moment';
import { SaveScheduledTimeForm } from 'src/model/forms/scheduled-time/SaveScheduledTimeForm';

@Injectable()
export class ScheduledTimeService {

    time = {
        open: '08:00',
        close: '18:00',
    };

    constructor(
        @InjectRepository(ScheduledTimeEntity)
        private readonly scheduledTimeRepo: Repository<ScheduledTimeEntity>,
    ) {}

    async saveOne({ date, time, orderId }: SaveScheduledTimeForm) {

        const fullDate = moment(`${date} ${time}`, 'DD/MM/YYYY HH:mm');

        const data = {
            date: fullDate.toDate(),
            time: fullDate.toDate(),
            order: { id: orderId },
        }

        return await this.scheduledTimeRepo.save(data);

    }

    async delete(scheduledId: number): Promise<DeleteResult> {
        return await this.scheduledTimeRepo.delete({ id: scheduledId });
    }

    async deleteByDate(date: Date): Promise<DeleteResult> {
        return await this.scheduledTimeRepo.delete({ date });
    }

    async findActivesDate(dateInString: string) {

        const date = moment(dateInString, 'DD/MM/YYYY').toDate();

        const scheduledDates = await this.scheduledTimeRepo.find({ date });
        const compareDate = moment(this.time.open, 'HH:mm');
        const close = moment(this.time.close, 'HH:mm');

        const activeTimes = [];

        while(compareDate.isSameOrBefore(close)) {

            const comparedTime = compareDate.format('HH:mm');
            const timeIsFree = !scheduledDates.some(date => {
                const scheduledDate = moment(date.time, 'HH:mm:ss').format('HH:mm');
                return scheduledDate === comparedTime;
            });

            if (timeIsFree) {
                activeTimes.push({ time: compareDate.format('HH:mm') });
            }

            compareDate.add(30, 'minutes');

        };

        return {
            date: dateInString,
            activeTimes,
        };

    }

}
