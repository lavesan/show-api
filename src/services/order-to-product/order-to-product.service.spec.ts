import { Test, TestingModule } from '@nestjs/testing';
import { OrderToProductService } from './order-to-product.service';

describe('OrderToProductService', () => {
  let service: OrderToProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderToProductService],
    }).compile();

    service = module.get<OrderToProductService>(OrderToProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
