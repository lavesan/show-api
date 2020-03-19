import { Module } from '@nestjs/common';
import { FilesController } from 'src/controllers/files/files.controller';

@Module({
    controllers: [FilesController],
})
export class FilesModule {}
