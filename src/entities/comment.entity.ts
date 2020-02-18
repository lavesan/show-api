import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity('com_comment')
export class CommentEntity {

    @PrimaryGeneratedColumn({ name: 'com_id' })
    id: number;

    @Column({ name: 'com_brief_comment', type: 'varchar' })
    briefComment: string;

    @Column({ name: 'com_active_place', type: 'integer', nullable: true })
    activePlace: number;

    @Column({ name: 'com_stars', type: 'integer', nullable: true })
    stars: number;

    @Column({ name: 'com_creation_date', type: 'timestamp', update: false })
    creationDate: Date;

    @Column({ name: 'com_update_date', type: 'timestamp', nullable: true })
    updateDate: Date;

    @ManyToOne(table => ProductEntity, product => product.id)
    @JoinColumn({ name: 'com_pro_id' })
    product: ProductEntity;

    @ManyToOne(table => UserEntity, user => user.id, { eager: true })
    @JoinColumn({ name: 'com_use_id' })
    user: UserEntity;

}
