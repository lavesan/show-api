import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from '../../services/address/address.service';
import { AddressEntity } from '../../entities/address.entity';
import { AddressController } from 'src/controllers/address/address.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([AddressEntity]),
      AddressModule,
    ],
    controllers: [AddressController],
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}
