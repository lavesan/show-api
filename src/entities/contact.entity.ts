import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ContactType } from '../model/constants/contact.constants';
import { UserEntity } from './user.entity';

@Entity('con_contact')
export class ContactEntity {

    @PrimaryGeneratedColumn({ name: 'con_id' })
    id: number;

    @Column({ name: 'con_number', type: 'varchar' })
    number: string;

    @Column({ name: 'con_ddd', type: 'varchar' })
    ddd: string;

    @Column({ name: 'con_type', type: 'integer' })
    type: ContactType;

    @Column({ name: 'con_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'con_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @ManyToOne(table => UserEntity, user => user.id)
    @JoinColumn({ name: 'con_use_id' })
    user: UserEntity;

}
