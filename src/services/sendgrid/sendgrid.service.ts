import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridService {

    private from: string;

    constructor() {
        this.from = process.env.SENDGRID_FROM;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async sendMail() {
        const msg = {
            to: 'darkflamemaster120@gmail.com',
            from: this.from,
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        return sgMail.send(msg);
    }

}
