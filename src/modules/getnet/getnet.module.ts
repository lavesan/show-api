import { Module, HttpModule } from '@nestjs/common';
import { GetnetService } from 'src/services/getnet/getnet.service';
import { GetnetController } from 'src/controllers/client/getnet/getnet.controller';

@Module({
    imports: [HttpModule],
    controllers: [GetnetController],
    providers: [GetnetService],
    exports: [GetnetService],
})
export class GetnetModule {}
