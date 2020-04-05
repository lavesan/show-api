import {MigrationInterface, QueryRunner} from "typeorm";

export class addTables1585525938547 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            ALTER TABLE ord_order
                ADD COLUMN ord_user_name VARCHAR(25);

            ALTER TABLE ord_order
                ADD COLUMN ord_legal_document VARCHAR(18);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            ALTER TABLE ord_order
                DROP COLUMN ord_user_name;
            ALTER TABLE ord_order
                DROP COLUMN ord_legal_document;
        `)
    }

}
