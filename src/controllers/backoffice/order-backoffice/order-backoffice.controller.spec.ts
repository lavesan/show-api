import { Test, TestingModule } from '@nestjs/testing';
import { OrderBackofficeController } from './order-backoffice.controller';

describe('OrderBackoffice Controller', () => {
  let controller: OrderBackofficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderBackofficeController],
    }).compile();

    controller = module.get<OrderBackofficeController>(OrderBackofficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
