import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

@Entity('com_comment')
export class CommentEntity {

    @PrimaryGeneratedColumn({ name: 'com_id' })
    id: number;

    @Column({ name: 'com_brief_comment', type: 'varchar' })
    briefComment: string;

    @Column({ name: 'com_active_place', type: 'boolean', nullable: true })
    activePlane: boolean;

    @Column({ name: 'com_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'com_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @ManyToOne(table => OrderEntity, order => order.id)
    @JoinColumn({ name: 'com_orp_id' })
    order: OrderEntity;

    @ManyToOne(table => UserEntity, user => user.id)
    @JoinColumn({ name: 'com_use_id' })
    user: UserEntity;

}
