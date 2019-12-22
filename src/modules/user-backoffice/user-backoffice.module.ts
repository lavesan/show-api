import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBackofficeService } from '../../services/user-backoffice/user-backoffice.service';
import { UserBackofficeEntity } from '../../entities/userBackoffice.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserBackofficeEntity]),
      UserBackofficeModule,
    ],
    providers: [UserBackofficeService],
    exports: [UserBackofficeService],
})
export class UserBackofficeModule {}
