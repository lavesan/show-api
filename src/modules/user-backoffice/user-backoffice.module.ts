import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBackofficeService } from '../../services/user-backoffice/user-backoffice.service';
import { UserBackofficeEntity } from '../../entities/user-backoffice.entity';
import { UserBackofficeController } from 'src/controllers/backoffice/user-backoffice/user-backoffice.controller';
import { SendgridModule } from '../sendgrid/sendgrid.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserBackofficeEntity]),
      UserBackofficeModule,
      SendgridModule,
    ],
    controllers: [UserBackofficeController],
    providers: [UserBackofficeService],
    exports: [UserBackofficeService],
})
export class UserBackofficeModule {}
