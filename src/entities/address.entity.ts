import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('adr_address')
export class AddressEntity {
    @PrimaryGeneratedColumn({ name: 'adr_id' })
    id: number;

    @Column({ name: 'adr_address', type: 'varchar' })
    address: string;

    @Column({ name: 'adr_cep', type: 'varchar' })
    cep: string;

    @Column({ name: 'adr_number', type: 'varchar' })
    number: string;

    @Column({ name: 'adr_complement', type: 'text', nullable: true })
    complement: string;

    @Column({ name: 'adr_type', type: 'text' })
    type: string;

    @Column({ name: 'adr_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'adr_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;
}
