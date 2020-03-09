import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserBackofficeRole, UserBackofficeStatus } from '../model/constants/user-backoffice.constants';
import { ProductEntity } from './product.entity';

@Entity('usb_user_backoffice')
export class UserBackofficeEntity {

    @PrimaryGeneratedColumn({ name: 'usb_id' })
    id: number;

    @Column({ name: 'usb_name', type: 'text' })
    name: string;

    @Column({ name: 'usb_email', type: 'text', unique: true })
    email: string;

    @Column({ name: 'usb_password', type: 'text' })
    password: string;

    @Column({ name: 'usb_forgot_password', type: 'integer', nullable: true })
    forgotPassword: string;

    @Column({ name: 'usb_forgot_password_creation', type: 'timestamp', nullable: true })
    forgotPasswordCreation: Date;

    @Column({ name: 'usb_img_url', type: 'text', nullable: true })
    imgUrl: string;

    @Column({ name: 'usb_reset_token', type: 'text', nullable: true })
    resetPassowrdToken: string;

    @Column({ name: 'usb_role', type: 'integer' })
    role: UserBackofficeRole;

    @Column({ name: 'usb_status', type: 'integer' })
    status: UserBackofficeStatus;

    @Column({ name: 'usb_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'usb_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @OneToMany(table => ProductEntity, product => product.backofficeWhoCreated)
    productsCreated: ProductEntity[];

    @OneToMany(table => ProductEntity, product => product.backofficeWhoUpdated)
    productsUpdated: ProductEntity[];

}
