import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

type MailType = 'default' | 'forgotPasswordAdmin' | 'confirmClient' | 'forgotPasswordClient';

@Injectable()
export class SendgridService {

    private from: string;

    constructor() {
        this.from = process.env.SENDGRID_FROM;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async sendMail({ type = 'default', ...params }) {

        const msg = this.msgHandler[type](params);
        return sgMail.send(msg);

    }

    private msgHandler = {
        forgotPasswordAdmin: ({ to, name, password }) => ({
            to,
            from: this.from,
            subject: 'Zero veneno administrador',
            text: 'Esqueci minha senha',
            html: `
                <h2>Olá ${name}!</h2>
                <p style="color: #aaa;">Se foi você que esqueceu a senha, por favor utilize a senha abaixo e efetue o login na sua conta:</p>
                ${password}
            `,
        }),
        confirmClient: ({ to, name }) => ({
            to,
            from: this.from,
            subject: 'Zero veneno loja',
            text: 'Confirmar email',
            html: `
                <h2>Olá ${name}!</h2>
                <p style="color: #aaa;">Obrigado por ter criado uma conta na zero veneno, espero que você goste dos produtos!</p>
                <p style="color: #aaa;">Para você se tornar um usuário com todos os benefícios (ofertas, notíficias...), então confirme seu email clicando no botão abaixo!</p>
                <a
                    href="http://localhost:3001/"
                    target="_blank"
                    style="border: thin solid #1a5914; background-color: #fff; color: #1a5914; border-radius: 5px; padding: 5px 15px;">
                    Confirmar e-mail
                </a>
            `,
        }),
        forgotPasswordClient: ({ to, name, password }) => ({
            to,
            from: this.from,
            subject: 'Zero veneno loja',
            text: 'Esqueci a senha',
            html: `
                <h2>Olá ${name}!</h2>
                <p style="color: #aaa;">Se foi você que esqueceu a senha, por favor utilize a senha abaixo e efetue o login na sua conta:</p>
                ${password}
            `,
        }),
        default() {},
    };

}
