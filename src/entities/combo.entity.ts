import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ProductComboStatus } from 'src/model/constants/product-combo.constants';

@Entity('cob_combo')
export class ComboEntity {

    @PrimaryGeneratedColumn({ name: 'cob_id' })
    id: number;

    @Column({ name: 'cob_value_cents', type: 'text' })
    totalValue: string;

    @Column({ name: 'cob_normal_value_cents', type: 'text' })
    normalValueCents: string;

    @Column({ name: 'cob_description', type: 'text' })
    description: string;

    @Column({ name: 'cob_brief_description', type: 'varchar', nullable: true })
    briefDescription: string;

    @Column({ name: 'cob_img_url', type: 'text', nullable: true })
    imgUrl: string;

    @Column({ name: 'cob_title', type: 'varchar' })
    title: string;

    @Column({ name: 'cob_status', type: 'integer' })
    status: ProductComboStatus;

    @Column({ name: 'cob_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'cob_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

}
