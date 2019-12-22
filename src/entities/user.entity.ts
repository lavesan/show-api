import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole, UserStatus } from '../model/constants/user.constants';

@Entity('use_user')
export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'use_id' })
    id: number;

    @Column({ name: 'use_email', type: 'text', unique: true })
    email: string;

    @Column({ name: 'use_password', type: 'text' })
    password: string;

    @Column({ name: 'use_name', type: 'text' })
    name: string;

    @Column({ name: 'use_status', type: 'integer' })
    status: UserStatus;

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
}
