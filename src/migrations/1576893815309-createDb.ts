import {MigrationInterface, QueryRunner} from "typeorm";

export class createDb1576893815309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            CREATE TABLE use_user (
                use_id SERIAL,
                use_email VARCHAR(45) NOT NULL UNIQUE,
                use_email_confirmed BOOLEAN,
                use_legal_document VARCHAR(14),
                use_legal_document_type VARCHAR(5),
                use_password VARCHAR(45) NOT NULL,
                use_forgot_password VARCHAR(45),
                use_forgot_password_creation TIMESTAMP,
                use_name TEXT NOT NULL,
                use_status INTEGER NOT NULL,
                use_img_url TEXT,
                use_age INTEGER,
                use_role INTEGER NOT NULL,
                use_gender INTEGER NOT NULL,
                use_animals INTEGER,
                use_childrens INTEGER,
                use_description TEXT NOT NULL,
                use_term_of_contract BOOLEAN NOT NULL,
                use_creation_date TIMESTAMP NOT NULL,
                use_update_date TIMESTAMP,
                PRIMARY KEY (use_id)
            );

            comment on column use_user.use_role is 'Tipo do usuário. (0 para nenhum, 1 para mãe, 2 para pai, 3 para estudante, 4 para vegano)';
            comment on column use_user.use_status is 'Status do usuário. (1 para ativo, 2 para inativo)';
            comment on column use_user.use_gender is 'Gênero do usuário. (1 para masculino, 2 para feminino)';
            comment on column use_user.use_animals is 'Número de animais que o cliente tem';

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

            CREATE TABLE pcb_product_combo (
                pcb_id SERIAL,
                pcb_title VARCHAR(15) NOT NULL,
                pcb_description TEXT,
                pcb_value_cents TEXT,
                pcb_status INTEGER NOT NULL,
                pcb_products_ids INTEGER[] NOT NULL,
                pcb_users_roles_will_appear INTEGER[],
                pcb_creation_date TIMESTAMP NOT NULL,
                pcb_update_date TIMESTAMP,
                PRIMARY KEY (pcb_id)
            );

            CREATE TABLE ord_order (
                ord_id SERIAL,
                ord_card_code VARCHAR(60),
                ord_type INTEGER NOT NULL,
                ord_payed BOOLEAN NOT NULL,
                ord_status INTEGER NOT NULL,
                ord_total_value_cents TEXT NOT NULL,
                ord_total_product_value_cents TEXT NOT NULL,
                ord_total_freight_value_cents TEXT,
                ord_receive_date DATE,
                ord_receive_time TIME,
                ord_payment_id TEXT,
                ord_get_on_market BOOLEAN,
                ord_change_value_cents TEXT,
                ord_creation_date TIMESTAMP NOT NULL,
                ord_update_date TIMESTAMP,
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
                cat_description TEXT,
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
                pro_quant_suffix VARCHAR(10) NOT NULL,
                pro_quantity_on_stock FLOAT8 NOT NULL,
                pro_description TEXT NOT NULL,
                pro_status INTEGER NOT NULL,
                pro_actual_value TEXT NOT NULL,
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

            comment on column pro_product.pro_status is 'Status do produto. 0 para ATIVO, 1 para INATIVO';
            comment on column pro_product.pro_actual_value is 'O valor atual que o produto está sendo vendido';
            comment on column pro_product.pro_quant_suffix is 'Sufixo da quantidade do produto (kg, x...)';

            -- Tabela que tem os dados de uma promoção
            CREATE TABLE prm_promotion (
                prm_id SERIAL,
                prm_title VARCHAR(20) NOT NULL,
                prm_description TEXT NOT NULL,
                prm_img_url TEXT,
                prm_status INTEGER NOT NULL,
                prm_creation_date TIMESTAMP NOT NULL,
                prm_user_type INTEGER[] NOT NULL,
                PRIMARY KEY (prm_id)
            );

            comment on column prm_promotion.prm_user_type is 'Array com tipos de usuário do ecommerce para que a promoção aparecerá';
            comment on column prm_promotion.prm_status is '1 para ativa, 2 para inativa';

            -- Tabela que linka o Produtom a Promoção e o valor dele nesta promoção
            CREATE TABLE pmo_product_promotion (
                pmo_id SERIAL,
                pmo_value_cents TEXT NOT NULL,
                pmo_prm_id INTEGER NOT NULL,
                pmo_pro_id INTEGER NOT NULL,
                PRIMARY KEY (pmo_id),
                FOREIGN KEY (pmo_prm_id) REFERENCES prm_promotion (prm_id),
                FOREIGN KEY (pmo_pro_id) REFERENCES pro_product (pro_id)
            );

            -- Tabela para linkar as ordens com os produtos
            CREATE TABLE orp_order_product (
                orp_id SERIAL,
                orp_quantity FLOAT8 NOT NULL,
                orp_ord_id INTEGER NOT NULL,
                orp_pro_id INTEGER,
                orp_pcb_id INTEGER,
                PRIMARY KEY (orp_id),
                FOREIGN KEY (orp_ord_id) REFERENCES ord_order (ord_id),
                FOREIGN KEY (orp_pro_id) REFERENCES pro_product (pro_id),
                FOREIGN KEY (orp_pcb_id) REFERENCES pcb_product_combo (pcb_id)
            );

            -- Tabela para linkar os comentários
            CREATE TABLE com_comment (
                com_id SERIAL,
                com_brief_comment VARCHAR(200) NOT NULL,
                com_stars INTEGER,
                com_active_place INTEGER,
                com_creation_date TIMESTAMP NOT NULL,
                com_update_date TIMESTAMP,
                com_pro_id INTEGER,
                com_use_id INTEGER NOT NULL,
                PRIMARY KEY (com_id),
                FOREIGN KEY (com_pro_id) REFERENCES pro_product (pro_id),
                FOREIGN KEY (com_use_id) REFERENCES use_user (use_id)
            );
            comment on column com_comment.com_active_place is 'O valor dele definirá em qual posição ele ficará na listagem de comentários';

        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.query(`
            DROP TABLE IF EXISTS orp_order_product;
            DROP TABLE IF EXISTS com_comment;
            DROP TABLE IF EXISTS prm_promotion CASCADE;
            DROP TABLE IF EXISTS pmo_product_promotion;
            DROP TABLE IF EXISTS pro_product;
            DROP TABLE IF EXISTS cat_category;
            DROP TABLE IF EXISTS ord_order CASCADE;
            DROP TABLE IF EXISTS pcb_product_combo;
            DROP TABLE IF EXISTS car_card;
            DROP TABLE IF EXISTS adr_address;
            DROP TABLE IF EXISTS con_contact;
            DROP TABLE IF EXISTS use_user;
            DROP TABLE IF EXISTS usb_user_backoffice;
        `);
    }

}
