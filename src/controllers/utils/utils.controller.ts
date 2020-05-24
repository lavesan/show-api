import { Controller, Get, Body, Post } from '@nestjs/common';
import { UtilsService } from 'src/services/utils/utils.service';
import { UtilsEntity } from 'src/entities/user.entity';

@Controller('utils')
export class UtilsController {

    constructor(private readonly utilsService: UtilsService) {}

    @Post()
    save(@Body() body: UtilsEntity) {
        return this.utilsService.save(body);
    }

    @Get()
    listAll() {
        return this.utilsService.findAll();
    }

}
