import {MigrationInterface, QueryRunner} from "typeorm";

export class createDb1576893815309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            CREATE TABLE use_user (
                use_id SERIAL,
                use_email VARCHAR(45) NOT NULL UNIQUE,
                use_email_confirmed BOOLEAN,
                use_password VARCHAR(45) NOT NULL,
                use_forgot_password VARCHAR(45),
                use_forgot_password_creation TIMESTAMP,
                use_name TEXT NOT NULL,
                use_status INTEGER NOT NULL,
                use_img_url TEXT,
                use_age INTEGER,
                use_role INTEGER NOT NULL,
                use_description TEXT NOT NULL,
                use_term_of_contract BOOLEAN NOT NULL,
                use_creation_date TIMESTAMP NOT NULL,
                use_update_date TIMESTAMP,
                PRIMARY KEY (use_id)
            );

            comment on column use_user.use_role is 'Tipo do usuário. (0 para nenhum, 1 para mãe, 2 para pai, 3 para estudante, 4 para vegano)';
            comment on column use_user.use_status is 'Status do usuário. (1 para ativo, 2 para inativo)';

            CREATE TABLE con_contact (
                con_id SERIAL,
                con_number VARCHAR(13) NOT NULL,
                con_ddd VARCHAR(3) NOT NULL,
                con_type INTEGER NOT NULL,
                con_creation_date TIMESTAMP NOT NULL,
                con_update_date TIMESTAMP,
                con_use_id INTEGER NOT NULL,
                PRIMARY KEY (con_id),
                FOREIGN KEY (con_use_id) REFERENCES use_user (use_id)
            );

            comment on column con_contact.con_type is '0 para um celular e 1 para telefone';

            CREATE TABLE adr_address (
                adr_id SERIAL,
                adr_address VARCHAR(60) NOT NULL,
                adr_cep VARCHAR(13) NOT NULL,
                adr_number VARCHAR(10) NOT NULL,
                adr_complement TEXT NOT NULL,
                adr_type TEXT NOT NULL,
                adr_creation_date TIMESTAMP NOT NULL,
                adr_update_date TIMESTAMP,
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
                car_creation_date TIMESTAMP NOT NULL,
                car_update_date TIMESTAMP,
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
                ord_payed BOOLEAN NOT NULL,
                ord_status INTEGER NOT NULL,
                ord_total_value_cents TEXT NOT NULL,
                ord_total_product_value_cents TEXT NOT NULL,
                ord_total_freight_value_cents TEXT,
                ord_get_on_market BOOLEAN,
                ord_change_value_cents TEXT,
                ord_creation_date TIMESTAMP NOT NULL,
                ord_update_date TIMESTAMP,
                ord_receive_date TIMESTAMP,
                ord_deleted_date TIMESTAMP,
                ord_deleted_reason TEXT,
                ord_user_type_who_deleted INTEGER,
                ord_use_id INTEGER,
                ord_adr_id INTEGER,
                PRIMARY KEY (ord_id),
                FOREIGN KEY (ord_use_id) REFERENCES use_user (use_id),
                FOREIGN KEY (ord_adr_id) REFERENCES adr_address (adr_id)
            );

            comment on column ord_order.ord_card_code is 'Código do cartão se a venda foi feita online';
            comment on column ord_order.ord_type is 'Tipo da venda (0 para dinheiro, 1 para crédito e 2 para débito)';
            comment on column ord_order.ord_status is 'Status do pedido. (0 para pedido feito, 1 para Preparando, 2 para Entregando, 3 para Entregue, 4 para cancelado)';
            comment on column ord_order.ord_total_value_cents is 'Valor total da venda';
            comment on column ord_order.ord_total_product_value_cents is 'Valor total dos produtos vendidos';
            comment on column ord_order.ord_total_freight_value_cents is 'Valor total do frete';
            comment on column ord_order.ord_get_on_market is 'Se é para pegar na loja ou não';
            comment on column ord_order.ord_change_value_cents is 'Se for dinheiro, ela vai existir e vai ser o valor que ele vai ter em mãos, para levar o troco';
            comment on column ord_order.ord_receive_date is 'Data e hora de recebimento, se for feita uma entrega';
            comment on column ord_order.ord_deleted_reason is 'Razão para o pedido ter sido removido';
            comment on column ord_order.ord_user_type_who_deleted is 'Tipo do usuário que deletou o pedido. 0 para backoffice e 1 para cliente do ecommerce';

            -- Tabela dos usuários backoffice
            CREATE TABLE usb_user_backoffice (
                usb_id SERIAL,
                usb_name TEXT NOT NULL,
                usb_email TEXT NOT NULL,
                usb_role INTEGER NOT NULL,
                usb_status INTEGER NOT NULL,
                usb_password TEXT NOT NULL,
                usb_forgot_password VARCHAR(45),
                usb_forgot_password_creation TIMESTAMP,
                usb_img_url TEXT,
                usb_reset_token TEXT,
                usb_creation_date TIMESTAMP NOT NULL,
                usb_update_date TIMESTAMP,
                PRIMARY KEY (usb_id)
            );

            comment on column usb_user_backoffice.usb_status is 'Status do usuário. 1 para ativo, 2 para inativo';

            -- Tabela de categorias
            CREATE TABLE cat_category (
                cat_id SERIAL,
                cat_name TEXT NOT NULL,
                cat_creation_date TIMESTAMP NOT NULL,
                cat_update_date TIMESTAMP,
                cat_subcategory_of_id INTEGER,
                PRIMARY KEY (cat_id),
                FOREIGN KEY (cat_subcategory_of_id) REFERENCES cat_category (cat_id)
            );

            comment on column cat_category.cat_subcategory_of_id is 'Se esta categoria for uma subcategoria, então esta coluna mostra de quem ela é';

            comment on column usb_user_backoffice.usb_role is 'Tipo do usuário. 0 para administrador, 1 para funcionário';

            CREATE TABLE pro_product (
                pro_id SERIAL,
                pro_name TEXT NOT NULL,
                pro_img_url TEXT,
                pro_description TEXT NOT NULL,
                pro_type INTEGER NOT NULL,
                pro_status INTEGER NOT NULL,
                pro_actual_value TEXT NOT NULL,
                pro_last_value TEXT,
                pro_creation_date TIMESTAMP NOT NULL,
                pro_update_date TIMESTAMP,
                pro_user_backoffice_who_created_id INTEGER NOT NULL,
                pro_user_backoffice_who_updated_id INTEGER,
                pro_category_id INTEGER NOT NULL,
                PRIMARY KEY (pro_id),
                FOREIGN KEY (pro_user_backoffice_who_created_id) REFERENCES usb_user_backoffice (usb_id),
                FOREIGN KEY (pro_user_backoffice_who_updated_id) REFERENCES usb_user_backoffice (usb_id),
                FOREIGN KEY (pro_category_id) REFERENCES cat_category (cat_id)
            );

            comment on column pro_product.pro_type is 'Tipo do produto. 0 para Normal, 1 para Promoção';
            comment on column pro_product.pro_status is 'Status do produto. 0 para ATIVO, 1 para INATIVO';
            comment on column pro_product.pro_actual_value is 'O valor atual que o produto está sendo vendido';
            comment on column pro_product.pro_last_value is 'O valor anterior que o produto estava sendo vendido, antes de uma promoção ou seja la o que for';

            -- Tabela para linkar as ordens com os produtos
            CREATE TABLE orp_order_product (
                orp_id SERIAL,
                orp_quantity FLOAT8 NOT NULL,
                orp_ord_id INTEGER NOT NULL,
                orp_pro_id INTEGER NOT NULL,
                PRIMARY KEY (orp_id),
                FOREIGN KEY (orp_ord_id) REFERENCES ord_order (ord_id),
                FOREIGN KEY (orp_pro_id) REFERENCES pro_product (pro_id)
            );

        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            DROP TABLE IF EXISTS orp_order_product;
            DROP TABLE IF EXISTS pro_product;
            DROP TABLE IF EXISTS cat_category;
            DROP TABLE IF EXISTS ord_order;
            DROP TABLE IF EXISTS car_card;
            DROP TABLE IF EXISTS adr_address;
            DROP TABLE IF EXISTS con_contact;
            DROP TABLE IF EXISTS use_user;
            DROP TABLE IF EXISTS usb_user_backoffice;
        `);
    }

}
