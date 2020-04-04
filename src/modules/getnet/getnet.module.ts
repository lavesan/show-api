import { Module, HttpModule } from '@nestjs/common';
import { GetnetService } from 'src/services/getnet/getnet.service';
import { CardModule } from '../card/card.module';

@Module({
    imports: [
        HttpModule,
        CardModule,
    ],
    providers: [GetnetService],
    exports: [GetnetService],
})
export class GetnetModule {}
