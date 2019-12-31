import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBackofficeService } from '../../services/user-backoffice/user-backoffice.service';
import { UserBackofficeEntity } from '../../entities/userBackoffice.entity';
import { UserBackofficeController } from 'src/controllers/backoffice/user-backoffice/user-backoffice.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserBackofficeEntity]),
      UserBackofficeModule,
    ],
    controllers: [UserBackofficeController],
    providers: [UserBackofficeService],
    exports: [UserBackofficeService],
})
export class UserBackofficeModule {}
