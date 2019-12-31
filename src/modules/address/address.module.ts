import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from '../../services/address/address.service';
import { AddressEntity } from '../../entities/address.entity';
import { AddressController } from 'src/controllers/address/address.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([AddressEntity]),
      AddressModule,
      UserModule,
    ],
    controllers: [AddressController],
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}
