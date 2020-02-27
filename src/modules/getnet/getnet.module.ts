import { Module, HttpModule } from '@nestjs/common';
import { GetnetService } from 'src/services/getnet/getnet.service';

@Module({
    imports: [HttpModule],
    providers: [GetnetService],
    exports: [GetnetService],
})
export class GetnetModule {}
