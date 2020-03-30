import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OrderType, OrderStatus, OrderUserWhoDeleted } from '../model/constants/order.constants';
import { UserEntity } from './user.entity';
import { OrderToProductEntity } from './orderToProduct.entity';
import { AddressEntity } from './address.entity';
import { ContactEntity } from './contact.entity';

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

    // TODO: Remover esta coluna
    @Column({ name: 'ord_get_on_market', type: 'boolean', nullable: true })
    getOnMarket: boolean;

    @Column({ name: 'ord_payed', type: 'boolean' })
    payed: boolean;

    @Column({ name: 'ord_description', type: 'varchar', nullable: true })
    description: string;

    @Column({ name: 'ord_payment_id', type: 'text', nullable: true })
    getnetPaymentId: boolean;

    // Troco
    @Column({ name: 'ord_change_value_cents', type: 'text', nullable: true })
    changeValueCents: string;

    @Column({ name: 'ord_receive_date', type: 'date', nullable: true })
    receiveDate: Date;

    @Column({ name: 'ord_receive_time', type: 'time', nullable: true })
    receiveTime: Date;

    @Column({ name: 'ord_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'ord_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @Column({ name: 'ord_deleted_date', type: 'timestamp', nullable: true })
    deleteDate: Date;

    @Column({ name: 'ord_user_name', type: 'varchar', nullable: true })
    clientName: string;

    @ManyToOne(table => UserEntity, user => user.id, { eager: true })
    @JoinColumn({ name: 'ord_use_id' })
    user: UserEntity;

    @ManyToOne(table => AddressEntity, address => address.id, { eager: true })
    @JoinColumn({ name: 'ord_adr_id' })
    address: AddressEntity;

    @ManyToOne(table => ContactEntity, address => address.id, { eager: true })
    @JoinColumn({ name: 'ord_con_id' })
    contact: ContactEntity;

    @OneToMany(type => OrderToProductEntity, ordToProd => ordToProd.order, { eager: true })
    orderToProd: OrderToProductEntity[];

}
