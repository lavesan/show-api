import { Controller, Get, Body, Post } from '@nestjs/common';
import { UtilsService } from 'src/services/utils/utils.service';
import { UtilsEntity } from 'src/entities/user.entity';
import { FilterForm } from 'src/models/FilterForm';

@Controller('utils')
export class UtilsController {

    constructor(private readonly utilsService: UtilsService) {}

    @Post()
    save(@Body() body: UtilsEntity) {
        return this.utilsService.save(body);
    }

    @Post('list')
    listAll(@Body() filter: FilterForm[]) {
        return this.utilsService.findAll(filter);
    }

}
