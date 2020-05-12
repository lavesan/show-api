import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import config = require('./ormconfig');

@Module({
  imports: [
    // On the 'load' you put all config files that use values of the '.env' file
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRoot(config()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {}
