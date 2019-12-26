import { Injectable, HttpService } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as fs from 'fs';

import { SaveCardForm } from 'src/model/forms/getnet/SaveCardForm';
import { Observable } from 'rxjs';

interface IGetnetLoginResponse {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    scope: 'oob';
}

@Injectable()
export class GetnetService {

    constructor(private readonly httpService: HttpService) {
        this.httpService.axiosRef.defaults.baseURL = 'https://api-sandbox.getnet.com.br';
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

        const clientId = '20daae27-da67-4c17-b1fe-4f9673951459';
        const clientSecret = 'd30e9f10-832b-4818-b8aa-2cf968b4d77b';

        // Transforms a String in a Base64 String
        const base64Token = btoa(`${clientId}:${clientSecret}`);
        const autorization = `Basic ${base64Token}`;

        const headers = {
            autorization,
        }

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
        }

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
        }

        return this.httpService.post('/v1/cards', body);

    }

}
