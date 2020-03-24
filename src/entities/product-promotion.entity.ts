import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pmo_product_promotion')
export class ProductPromotionEntity {

    @PrimaryGeneratedColumn({ name: 'pmo_id' })
    id: number;

    @Column({ name: 'pmo_value_cents', type: 'text' })
    valueCents: string;

    @Column({ name: 'pmo_prm_id', type: 'integer' })
    promotionId: number;

    @Column({ name: 'pmo_pro_id', type: 'integer' })
    productId: number;

}
