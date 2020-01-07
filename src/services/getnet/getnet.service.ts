import { Injectable, HttpService } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as fs from 'fs';

import { SaveCardForm } from 'src/model/forms/getnet/SaveCardForm';

interface IGetnetLoginResponse {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    scope: 'oob';
}

@Injectable()
export class GetnetService {

    constructor(private readonly httpService: HttpService) {
        // 'https://api-sandbox.getnet.com.br'
        this.httpService.axiosRef.defaults.baseURL = process.env.GETNET_API_URL;
        this.httpService.axiosRef.interceptors.request.use(req => this.addAuthHeader(req));
    }

    private readonly jsonFile = 'getnet-data.json';

    private addAuthHeader(req: AxiosRequestConfig): AxiosRequestConfig {

        const rawData: any = fs.readFileSync(this.jsonFile);

        if (rawData) {

            const { token_type, access_token }: IGetnetLoginResponse = JSON.parse(rawData);
            const autorization = `${token_type} ${access_token}`;

            req.headers = {
                ...req.headers,
                autorization,
            };

        }

        return req;

    }

    async writeAuthTokenOnFile() {

        const loginAuth = await this.login();

        if (loginAuth) {

            const stringifyData = JSON.stringify(loginAuth.data);
            fs.writeFileSync(this.jsonFile, stringifyData);

        }

    }

    /**
     * @description Autentica o cliente para usar os serviços da getnet
     */
    private async login(): Promise<AxiosResponse<IGetnetLoginResponse>> {

        const clientId = process.env.GETNET_CLIENT_ID;
        const clientSecret = process.env.GETNET_CLIENT_SECRET;

        // Transforms a String in a Base64 String
        const base64Token = btoa(`${clientId}:${clientSecret}`);
        const autorization = `Basic ${base64Token}`;

        const headers = {
            autorization,
        };

        return this.httpService.post('/auth/oauth/v2/token?scope=oob&grant_type=client_credentials',
            null,
            { headers },
        ).toPromise();

    }

    async getCardToken(cardNumber: string, userId: number): Promise<any> {
        // TODO: Vou precisar pegar o ID do ecommerce de Lis e utilizar, isto é OBRIGATÓRIO quando for para produção
        // https://developers.getnet.com.br/api#tag/Tokenizacao%2Fpaths%2F~1v1~1tokens~1card%2Fpost

        const body = {
            card_number: cardNumber,
            customer_id: userId,
        };

        // Tando tudo correto, retorna um objeto com 'number_token' para eu utilizar nas requisições que farei
        return this.httpService.post('/v1/tokens/card', body);

    }

    async saveCard({ brand, nameOnCard, cardNumber, expirationMonth, expirationYear, securityCode }: SaveCardForm) {

        const numberToken = await this.getCardToken(cardNumber, 1);

        const body = {
            brand,
            number_token: numberToken,
            cardholder_name: nameOnCard,
            expiration_month: expirationMonth,
            expiration_year: expirationYear,
            security_code: securityCode,
            cardholder_identification: 'cpf ou cnpj do usuário',
            customer_id: 1,
            verify_card: true,
        };

        return this.httpService.post('/v1/cards', body);

    }

    async downloadPdf(paymentId: string) {
        return this.httpService.get(`https://api-homologacao.getnet.com.br/v1/payments/boleto/${paymentId}/pdf`);
    }

    /**
     * @description Solicita o cancelamento de compras feitas a mais de um dia
     */
    async orderCancel() {

        const data = {

        };

        return this.httpService.post('/v1/payments/cancel/request');
    }

    /**
     * @description Cancela pagamentos feitos APENAS NO MESMO DIA
     * @param {string} paymentId
     */
    async cancelPayment(paymentId: string) {
        return this.httpService.post(`https://api-homologacao.getnet.com.br/v1/payments/credit/${paymentId}/cancel`);
    }

    /**
     * @description Adicionar corpo com lógica https://developers.getnet.com.br/api#tag/Pagamento%2Fpaths%2F~1v1~1payments~1debit%2Fpost
     */
    private async payDebit() {

        const data = {

        };

        return this.httpService.post('/v1/payments/debit');
    }

    /**
     * @description Adicionar corpo com lógica https://developers.getnet.com.br/api#tag/Pagamento%2Fpaths%2F~1v1~1payments~1credit%2Fpost
     */
    private async payCredit() {

        const data = {

        };

        return this.httpService.post('/v1/payments/credit');
    }

    /**
     * @description Verifica se o cartão é válido. APENAS Mastercard e Visa
     */
    private async verifyCard() {

        const data = {
            number_token: "dfe05208b105578c070f806c80abd3af09e246827d29b866cf4ce16c205849977c9496cbf0d0234f42339937f327747075f68763537b90b31389e01231d4d13c",
            brand: "Mastercard",
            cardholder_name: "JOAO DA SILVA",
            expiration_month: "12",
            expiration_year: "20",
            security_code: "123"
        };

        return this.httpService.post(`/v1/cards/verification`, data);
    }

}
