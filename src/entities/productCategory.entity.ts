import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity('cat_category')
export class ProductCategoryEntity {

    @PrimaryGeneratedColumn({ name: 'cat_id' })
    id: number;

    @Column({ name: 'cat_name', type: 'text' })
    name: string;

    @Column({ name: 'cat_description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'cat_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'cat_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    // TODO: Adiciona relação 1 para 1 com a própria entidade
    // @OneToOne(table => ProductCategoryEntity, productCategory => productCategory.id, { lazy: true, cascade: true, persistence: true })
    @Column({ name: 'cat_subcategory_of_id', nullable: true })
    subCategoryOfId: number;

}
