import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CardType } from '../model/constants/card.constants';
import { UserEntity } from './user.entity';

@Entity('car_card')
export class CardEntity {
    @PrimaryGeneratedColumn({ name: 'car_id' })
    id: number;

    @Column({ name: 'car_last_digits', type: 'varchar' })
    lastDigits: string;

    @Column({ name: 'car_brand', type: 'text' })
    brand: string;

    @Column({ name: 'car_getnet_id', type: 'text' })
    getnetId: string;

    @Column({ name: 'car_type', type: 'integer' })
    type: CardType;

    @Column({ name: 'car_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'car_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @ManyToOne(table => UserEntity, user => user.id)
    @JoinColumn({ name: 'car_use_id' })
    user: UserEntity;
}
