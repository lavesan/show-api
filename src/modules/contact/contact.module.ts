import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from '../../services/contact/contact.service';
import { ContactEntity } from '../../entities/contact.entity';
import { ContactController } from 'src/controllers/contact/contact.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([ContactEntity]),
      ContactModule,
    ],
    controllers: [ContactController],
    providers: [ContactService],
    exports: [ContactService],
})
export class ContactModule {}
