import { Controller, Get, Header } from '@nestjs/common';
import * as fs from 'fs';

@Controller('files')
export class FilesController {

    @Get('term-of-contract')
    @Header('content-type', 'application/pdf')
    sendTermOfContract() {
        const term = fs.readFileSync('./src/files/Termo-de-contrato-ZEROVENENOSITIO.pdf');
        return `data:application/pdf;base64,${term.toString('base64')}`;
    }

}
