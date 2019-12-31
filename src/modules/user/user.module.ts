import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entities/user.entity';
import { BackofficeUserController } from 'src/controllers/backoffice/user/backoffice-user.controller';
import { UserController } from 'src/controllers/client/user/user.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserEntity]),
      UserModule,
    ],
    controllers: [UserController, BackofficeUserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
