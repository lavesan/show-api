import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from 'src/model/constants/user.constants';

@Entity('pcb_product_combo')
export class ProductComboEntity {

    @PrimaryGeneratedColumn({ name: 'pcb_id' })
    id: number;

    @Column({ name: 'pcb_value_cents', type: 'text' })
    totalValue: string;

    @Column({ name: 'pcb_description', type: 'text' })
    description: string;

    @Column({ name: 'pcb_title', type: 'varchar' })
    title: string;

    @Column('integer', {
        name: 'pcb_products_ids',
        array: true,
    })
    productsIds: number[];

    @Column('integer', {
        name: 'pcb_products_ids',
        array: true,
    })
    userWithRolesToShow: UserRole[];

    @Column({ name: 'pcb_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'pcb_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

}
