import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from '../../services/address/address.service';
import { AddressEntity } from '../../entities/address.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([AddressEntity]),
      AddressModule,
    ],
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}
