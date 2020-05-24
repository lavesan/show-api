import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsEntity } from 'src/entities/user.entity';
import { UtilsController } from 'src/controllers/utils/utils.controller';
import { UtilsService } from 'src/services/utils/utils.service';

@Module({
    imports: [TypeOrmModule.forFeature([UtilsEntity])],
    controllers: [UtilsController],
    providers: [UtilsService],
})
export class UtilsModule {}
