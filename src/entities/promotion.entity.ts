import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { ProductPromotionEntity } from './product-promotion.entity';
import { UserRole } from 'src/model/constants/user.constants';
import { PromotionStatus } from 'src/model/constants/promotion.constants';

@Entity('prm_promotion')
export class PromotionEntity {

    @PrimaryGeneratedColumn({ name: 'prm_id' })
    id: number;

    @Column({ name: 'prm_status', type: 'integer' })
    status: PromotionStatus;

    @Column({ name: 'prm_title', type: 'varchar' })
    title: string;

    @Column({ name: 'prm_description', type: 'text' })
    description: string;

    @Column({ name: 'prm_brief_description', type: 'text', nullable: true })
    briefDescription: string;

    @Column({ name: 'prm_img_url', type: 'text', nullable: true })
    imgUrl: string;

    @Column('integer', {
        name: 'prm_user_type',
        array: true,
    })
    userTypes: UserRole[];

    @Column({ name: 'prm_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

}
