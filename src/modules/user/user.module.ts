import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entities/user.entity';
import { UserController } from 'src/controllers/user/user.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserEntity]),
      UserModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
