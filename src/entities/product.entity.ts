import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductStatus } from 'src/model/constants/product.constants';
import { UserBackofficeEntity } from './user-backoffice.entity';
import { OrderToProductEntity } from './orderToProduct.entity';
import { ProductCategoryEntity } from './productCategory.entity';

@Entity('pro_product')
export class ProductEntity {

    @PrimaryGeneratedColumn({ name: 'pro_id' })
    id: number;

    @Column({ name: 'pro_name', type: 'text' })
    name: string;

    @Column({ name: 'pro_img_url', type: 'text', nullable: true })
    imgUrl: string;

    @Column({ name: 'pro_quant_suffix', type: 'varchar' })
    quantitySuffix: string;

    @Column({ name: 'pro_quantity_on_stock', type: 'float8' })
    quantityOnStock: number;

    @Column({ name: 'pro_description', type: 'text' })
    description: string;

    @Column({ name: 'pro_status', type: 'integer' })
    status: ProductStatus;

    @Column({ name: 'pro_actual_value', type: 'text' })
    actualValueCents: string;

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

    @OneToMany(type => OrderToProductEntity, ordToProd => ordToProd.product)
    orderToProd: OrderToProductEntity[];

    @ManyToOne(type => ProductCategoryEntity, productCategory => productCategory.id, { eager: true })
    @JoinColumn({ name: 'pro_category_id' })
    category: ProductCategoryEntity;

}
