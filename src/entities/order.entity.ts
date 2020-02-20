import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OrderType, OrderStatus, OrderUserWhoDeleted } from '../model/constants/order.constants';
import { UserEntity } from './user.entity';
import { OrderToProductEntity } from './orderToProduct.entity';
import { ScheduledTimeEntity } from './scheduled-time.entity';

@Entity('ord_order')
export class OrderEntity {

    @PrimaryGeneratedColumn({ name: 'ord_id' })
    id: number;

    @Column({ name: 'ord_card_code', type: 'varchar', nullable: true })
    cardCode: string;

    @Column({ name: 'ord_type', type: 'integer' })
    type: OrderType;

    @Column({ name: 'ord_status', type: 'integer' })
    status: OrderStatus;

    @Column({ name: 'ord_total_value_cents', type: 'text' })
    totalValueCents: string;

    @Column({ name: 'ord_total_product_value_cents', type: 'text' })
    totalProductValueCents: string;

    @Column({ name: 'ord_total_freight_value_cents', type: 'text', nullable: true })
    totalFreightValuesCents: string;

    @Column({ name: 'ord_deleted_reason', type: 'text', nullable: true })
    deletedReason: string;

    @Column({ name: 'ord_user_type_who_deleted', type: 'integer', nullable: true })
    userTypeWhoDeleted: OrderUserWhoDeleted;

    @Column({ name: 'ord_get_on_market', type: 'boolean' })
    getOnMarket: boolean;

    @Column({ name: 'ord_payed', type: 'boolean' })
    payed: boolean;

    // Troco
    @Column({ name: 'ord_change_value_cents', type: 'text', nullable: true })
    changeValueCents: string;

    @Column({ name: 'ord_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'ord_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @Column({ name: 'ord_deleted_date', type: 'timestamp', nullable: true })
    deleteDate: Date;

    @ManyToOne(table => UserEntity, user => user.id)
    @JoinColumn({ name: 'ord_use_id' })
    user: UserEntity;

    @OneToMany(type => OrderToProductEntity, ordToProd => ordToProd.order)
    orderToProd: OrderToProductEntity[];

    @OneToOne(table => ScheduledTimeEntity, scheduledTime => scheduledTime.id)
    @JoinColumn({ name: 'ord_tim_id' })
    order: ScheduledTimeEntity;

}
