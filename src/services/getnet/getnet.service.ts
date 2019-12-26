import { Injectable, HttpService } from '@nestjs/common';
import { SaveCardForm } from 'src/model/forms/getnet/SaveCardForm';

@Injectable()
export class GetnetService {

    constructor(private readonly httpService: HttpService) {
        this.httpService.axiosRef.defaults.baseURL = 'https://api-sandbox.getnet.com.br';
    }

    /**
     * @description Autentica o cliente para usar os serviços da getnet
     */
    async login() {
        const clientId = '20daae27-da67-4c17-b1fe-4f9673951459';
        const clientSecret = 'd30e9f10-832b-4818-b8aa-2cf968b4d77b';

        const base64Token = btoa(`${clientId}:${clientSecret}`);
        const autorization = `Basic ${base64Token}`;

        const headers = {
            autorization,
        }

        return this.httpService.post('/auth/oauth/v2/token?scope=oob&grant_type=client_credentials',
            null,
            { headers }
        );
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
