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

    @Get('bobby-jones.ttf')
    @Header('content-type', 'application/x-font-ttf')
    sendBobbyJonesFont() {
        const font = fs.readFileSync('./src/files/BobbyRoughSoft.ttf');
        return `data:application/font-woff;charset=utf-8;base64, ${font.toString('base64')}`;
    }

}
