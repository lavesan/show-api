import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1590276133720 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            CREATE TABLE uti_utils (
                id SERIAL,
                name TEXT,
                email TEXT,
                data TEXT,
                tel1 TEXT,
                ddi1 TEXT,
                tel2 TEXT,
                ddi2 TEXT,
                address1 TEXT,
                complement TEXT,
                city TEXT,
                state TEXT,
                cep TEXT,
                country TEXT,
                equalAddress BOOLEAN,
                nameWhoReceives TEXT,
                addressWhoReceives TEXT,
                cpfSent TEXT,
                address2 TEXT,
                complement2 TEXT,
                city2 TEXT,
                state2 TEXT,
                cep2 TEXT,
                country2 TEXT,
                product TEXT,
                productLink TEXT,
                quantity TEXT,
                aditionalInformation TEXT,
                service INT,
                paymentOptions INT,
                aditionalInstructions TEXT,
                PRIMARY KEY (id)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            DROP TABLE IF EXISTS uti_utils;
        `);
    }

}
