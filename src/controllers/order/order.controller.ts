import { Controller, Post, Body } from '@nestjs/common';

@Controller('order')
export class OrderController {
    @Post()
    saveOrder(@Body() body) {

    }
}
