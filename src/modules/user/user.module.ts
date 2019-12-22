import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entities/user.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserEntity]),
      UserModule,
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
