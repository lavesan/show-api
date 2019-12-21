import {MigrationInterface, QueryRunner} from "typeorm";

export class createDb1576893815309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            CREATE TABLE use_user (
                use_id SERIAL,
                use_email VARCHAR(45) NOT NULL UNIQUE,
                use_password VARCHAR(45) NOT NULL,
                use_name TEXT NOT NULL,
                use_age INTEGER,
                use_img_url TEXT,
                use_role INTEGER NOT NULL,
                use_description TEXT NOT NULL,
                use_term_of_contract BOOLEAN NOT NULL,
                PRIMARY KEY (use_id)
            );

            comment on column use_user.use_role is 'Tipo do usuário. (0 para nenhum, 1 para mãe, 2 para pai, 3 para estudante, 4 para vegano)';

            CREATE TABLE con_contact (
                con_id SERIAL,
                con_number VARCHAR(13) NOT NULL,
                con_ddd VARCHAR(3) NOT NULL,
                con_type INTEGER NOT NULL,
                con_use_id INTEGER NOT NULL,
                PRIMARY KEY (con_id),
                FOREIGN KEY (con_use_id) REFERENCES use_user (use_id)
            );

            comment on column con_contact.con_type is 'Se o contato é um celular ou telefone';

            CREATE TABLE adr_address (
                adr_id SERIAL,
                adr_address VARCHAR(60) NOT NULL,
                adr_cep VARCHAR(13) NOT NULL,
                adr_number VARCHAR(10) NOT NULL,
                adr_complement TEXT NOT NULL,
                adr_type TEXT NOT NULL,
                adr_use_id INTEGER NOT NULL,
                PRIMARY KEY (adr_id),
                FOREIGN KEY (adr_use_id) REFERENCES use_user (use_id)
            );

            comment on column adr_address.adr_type is 'O nome deste endereço. Exp.: casa, sei la, loja...';

            CREATE TABLE car_card (
                car_id SERIAL,
                car_type INTEGER NOT NULL,
                car_last_digits VARCHAR(4) NOT NULL,
                car_brand TEXT NOT NULL,
                car_getnet_id TEXT NOT NULL,
                car_use_id INTEGER NOT NULL,
                PRIMARY KEY (car_id),
                FOREIGN KEY (car_use_id) REFERENCES use_user (use_id)
            );

            comment on column car_card.car_type is 'Tipo do cartão. 0 para Crédito, 1 para Débito';
            comment on column car_card.car_last_digits is 'Últimos 4 dígitos do cartão';
            comment on column car_card.car_brand is 'Bandeira do cartão';
            comment on column car_card.car_getnet_id is 'Id para coletar token, deletar cartões e atualizar cartão do cofre da getnet';

            CREATE TABLE ord_order (
                ord_id SERIAL,
                ord_card_code VARCHAR(60),
                ord_type INTEGER NOT NULL,
                ord_total_value_cents TEXT NOT NULL,
                ord_total_product_value_cents TEXT NOT NULL,
                ord_total_freight_value_cents TEXT,
                ord_get_on_market BOOLEAN,
                ord_change_value_cents TEXT,
                ord_use_id INTEGER NOT NULL,
                ord_adr_id INTEGER,
                PRIMARY KEY (ord_id),
                FOREIGN KEY (ord_use_id) REFERENCES use_user (use_id),
                FOREIGN KEY (ord_adr_id) REFERENCES adr_address (adr_id)
            );

            comment on column ord_order.ord_card_code is 'Código do cartão se a venda foi feita online';
            comment on column ord_order.ord_type is 'Tipo da venda (0 para dinheiro, 1 para crédito e 2 para débito)';
            comment on column ord_order.ord_total_value_cents is 'Valor total da venda';
            comment on column ord_order.ord_total_product_value_cents is 'Valor total dos produtos vendidos';
            comment on column ord_order.ord_total_freight_value_cents is 'Valor total do frete';
            comment on column ord_order.ord_get_on_market is 'Se é para pegar na loja ou não';
            comment on column ord_order.ord_change_value_cents is 'Se for dinheiro, ela vai existir e vai ser o valor que ele vai ter em mãos, para levar o troco';

            CREATE TABLE pro_product (
                pro_id SERIAL,
                pro_name TEXT NOT NULL,
                pro_img_url TEXT,
                pro_description TEXT NOT NULL,
                pro_type INTEGER NOT NULL,
                pro_actual_value TEXT NOT NULL,
                pro_last_value TEXT,
                PRIMARY KEY (pro_id)
            );

            comment on column pro_product.pro_type is 'Tipo do produto. 0 para Normal, 1 para Promoção';
            comment on column pro_product.pro_actual_value is 'O valor atual que o produto está sendo vendido';
            comment on column pro_product.pro_last_value is 'O valor anterior que o produto estava sendo vendido, antes de uma promoção ou seja la o que for';

            -- Tabela dos usuários backoffice
            CREATE TABLE usb_user_backoffice (
                usb_id SERIAL,
                usb_name TEXT NOT NULL,
                usb_email TEXT NOT NULL,
                usb_role INTEGER NOT NULL,
                usb_password TEXT NOT NULL,
                usb_img_url TEXT,
                PRIMARY KEY (usb_id)
            );

            comment on column usb_user_backoffice.usb_role is 'Tipo do usuário. 0 para administrador, 1 para funcionário';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            DROP TABLE use_user;
        `);
    }

}
