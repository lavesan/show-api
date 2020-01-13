import { Controller, Post, Body } from '@nestjs/common';
import { GetnetService } from 'src/services/getnet/getnet.service';

@Controller('getnet')
export class GetnetController {

    constructor(private readonly getnetService: GetnetService) {}

    // Rota que eu iniciarei o pagamento por débito
    @Post('debit-payment')
    payDebit(@Body() body): any {
        return this.getnetService.payDebit(body);
    }

    // Rota que o banco enviará ao meu back-end para informar que a transação ocorreu certo
    @Post('authenticate-debit-payment')
    authenticateDebitPayment(@Body() body): any {
        return this.getnetService.authenticateDebitPayment(body);
    }

}
