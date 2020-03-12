import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ComboEntity } from './combo.entity';
import { ProductEntity } from './product.entity';

@Entity('pcb_product_combo')
export class ComboToProductEntity {

    @PrimaryGeneratedColumn({ name: 'pcb_id' })
    id: number;

    @Column({ name: 'pcb_quantity', type: 'float8' })
    quantity: number;

    @ManyToOne(table => ComboEntity, combo => combo.id)
    @JoinColumn({ name: 'pcb_cob_id' })
    // @Column({ name: 'pcb_cob_id', type: 'text' })
    combo: ComboEntity;

    @ManyToOne(table => ProductEntity, product => product.id, { eager: true })
    @JoinColumn({ name: 'pcb_pro_id' })
    // @Column({ name: 'pcb_pro_id', type: 'varchar' })
    product: ProductEntity;

}
