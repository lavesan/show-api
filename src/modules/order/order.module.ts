import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../../services/order/order.service';
import { OrderEntity } from '../../entities/order.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([OrderEntity]),
      OrderModule,
    ],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}
