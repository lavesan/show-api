import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from '../../services/contact/contact.service';
import { ContactEntity } from '../../entities/contact.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([ContactEntity]),
      ContactModule,
    ],
    providers: [ContactService],
    exports: [ContactService],
})
export class ContactModule {}
