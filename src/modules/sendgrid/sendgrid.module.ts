import { Module } from '@nestjs/common';
import { SendgridService } from 'src/services/sendgrid/sendgrid.service';

@Module({
    imports: [SendgridModule],
    providers: [SendgridService],
    exports: [SendgridService],
})
export class SendgridModule {}
