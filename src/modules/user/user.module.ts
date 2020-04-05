import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entities/user.entity';
import { BackofficeUserController } from 'src/controllers/backoffice/user/backoffice-user.controller';
import { UserController } from 'src/controllers/client/user/user.controller';
import { ContactModule } from '../contact/contact.module';
import { AddressModule } from '../address/address.module';
import { CardModule } from '../card/card.module';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserEntity]),
      forwardRef(() => OrderModule),
      ContactModule,
      AddressModule,
      UserModule,
      CardModule,
    ],
    controllers: [UserController, BackofficeUserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
