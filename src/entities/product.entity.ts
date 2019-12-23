import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductType, ProductStatus, ProductCategory } from 'src/model/constants/product.constants';
import { UserBackofficeEntity } from './userBackoffice.entity';

@Entity('pro_product')
export class ProductEntity {
    @PrimaryGeneratedColumn({ name: 'pro_id' })
    id: number;

    @Column({ name: 'pro_name', type: 'text' })
    name: string;

    @Column({ name: 'pro_img_url', type: 'integer', nullable: true })
    imgUrl: string;

    @Column({ name: 'pro_description', type: 'text' })
    description: string;

    @Column({ name: 'pro_type', type: 'integer' })
    type: ProductType;

    @Column({ name: 'pro_status', type: 'integer' })
    status: ProductStatus;

    @Column({ name: 'pro_category', type: 'integer' })
    category: ProductCategory;

    @Column({ name: 'pro_actual_value', type: 'text' })
    actualValueCents: string;

    @Column({ name: 'pro_last_value', type: 'text' })
    lastValueCents: string;

    @Column({ name: 'pro_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'pro_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @ManyToOne(table => UserBackofficeEntity, userBackoffce => userBackoffce.id)
    @JoinColumn({ name: 'pro_user_backoffice_who_created_id' })
    backofficeWhoCreated: UserBackofficeEntity;

    @ManyToOne(table => UserBackofficeEntity, userBackoffce => userBackoffce.id)
    @JoinColumn({ name: 'pro_user_backoffice_who_updated_id' })
    backofficeWhoUpdated: UserBackofficeEntity;
}
