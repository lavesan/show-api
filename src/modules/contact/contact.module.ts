import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from '../../services/contact/contact.service';
import { ContactEntity } from '../../entities/contact.entity';
import { ContactController } from 'src/controllers/contact/contact.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([ContactEntity]),
      ContactModule,
      UserModule,
    ],
    controllers: [ContactController],
    providers: [ContactService],
    exports: [ContactService],
})
export class ContactModule {}
