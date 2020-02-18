import {MigrationInterface, QueryRunner} from "typeorm";

export class combo1582051252155 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        return await queryRunner.query(`
            CREATE TABLE pcb_product_combo (
                pcb_id SERIAL,
                pcb_title VARCHAR(15) NOT NULL,
                pcb_description TEXT,
                pcb_value_cents TEXT,
                pcb_products_ids INTEGER[] NOT NULL,
                pcb_users_roles_will_appear INTEGER[],
                pcb_creation_date TIMESTAMP NOT NULL,
                pcb_update_date TIMESTAMP,
                PRIMARY KEY (pcb_id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            DROP TABLE IF EXISTS pcb_product_combo;
        `)
    }

}
