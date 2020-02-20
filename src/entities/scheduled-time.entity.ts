import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('tim_scheduled_time')
export class ScheduledTimeEntity {

    @PrimaryGeneratedColumn({ name: 'tim_id' })
    id: number;

    @Column({ name: 'tim_date', type: 'date' })
    date: Date;

    @Column({ name: 'tim_time', type: 'time' })
    time: Date;

    @OneToOne(table => OrderEntity, order => order.id)
    @JoinColumn({ name: 'tim_ord_id' })
    order: OrderEntity;

}
