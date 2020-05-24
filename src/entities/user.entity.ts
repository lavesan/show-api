import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('uti_utils')
export class UtilsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    data: string;

    @Column({ nullable: true })
    tel1: string;

    @Column({ nullable: true })
    ddi1: string;

    @Column({ nullable: true })
    tel2: string;

    @Column({ nullable: true })
    ddi2: string;

    @Column({ nullable: true })
    address1: string;

    @Column({ nullable: true })
    complement: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    cep: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    equalAddress: boolean;

    @Column({ nullable: true })
    nameWhoReceives: string;

    @Column({ nullable: true })
    addressWhoReceives: string;

    @Column({ nullable: true })
    cpfSent: string;

    @Column({ nullable: true })
    address2: string;

    @Column({ nullable: true })
    complement2: string;

    @Column({ nullable: true })
    city2: string;

    @Column({ nullable: true })
    state2: string;

    @Column({ nullable: true })
    cep2: string;

    @Column({ nullable: true })
    country2: string;

    @Column({ nullable: true })
    product: string;

    @Column({ nullable: true })
    productLink: string;

    @Column({ nullable: true })
    quantity: string;

    @Column({ nullable: true })
    aditionalInformation: string;

    // sendProductPhoto: false,
    // base64Photo: string;
    @Column({ nullable: true })
    service: number;

    @Column({ nullable: true })
    paymentOptions: number;

    @Column({ nullable: true })
    aditionalInstructions: string;

}
