import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole, UserStatus, UserGender } from '../model/constants/user.constants';
import { AddressEntity } from './address.entity';
import { CardEntity } from './card.entity';
import { OrderEntity } from './order.entity';

@Entity('use_user')
export class UserEntity {

    @PrimaryGeneratedColumn({ name: 'use_id' })
    id: number;

    @Column({ name: 'use_email', type: 'text', unique: true })
    email: string;

    @Column({ name: 'use_email_confirmed', type: 'boolean' })
    emailConfirmed: boolean;

    @Column({ name: 'use_password', type: 'text' })
    password: string;

    @Column({ name: 'use_forgot_password', type: 'text', nullable: true })
    forgotPassword: string;

    @Column({ name: 'use_forgot_password_creation', type: 'timestamp', nullable: true })
    forgotPasswordCreation: Date;

    /** @description CPF or CNPJ */
    @Column({ name: 'use_legal_document', type: 'varchar', nullable: true })
    legalDocument: string;

    @Column({ name: 'use_legal_document_type', type: 'varchar', nullable: true })
    legalDocumentType: string;

    @Column({ name: 'use_name', type: 'text' })
    name: string;

    @Column({ name: 'use_status', type: 'integer' })
    status: UserStatus;

    @Column({ name: 'use_gender', type: 'integer' })
    gender: UserGender;

    @Column({ name: 'use_animals', type: 'integer' })
    animalsQuantity: number;

    @Column({ name: 'use_childrens', type: 'integer' })
    childrensQuantity: number;

    @Column({ name: 'use_img_url', type: 'text', nullable: true })
    imgUrl: string;

    @Column({ name: 'use_age', type: 'integer', nullable: true })
    age: number;

    @Column({ name: 'use_role', type: 'integer' })
    role: UserRole;

    @Column({ name: 'use_description', type: 'text' })
    description: string;

    @Column({ name: 'use_term_of_contract', type: 'boolean' })
    termOfContract: boolean;

    @Column({ name: 'use_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'use_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @OneToMany(table => AddressEntity, address => address.user)
    addresses: AddressEntity[];

    @OneToMany(table => OrderEntity, order => order.user)
    orders: OrderEntity[];

    @OneToMany(table => CardEntity, card => card.user)
    cards: CardEntity[];

}
