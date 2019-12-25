import { Test, TestingModule } from '@nestjs/testing';
import { BackofficeProductController } from './backoffice-product.controller';

describe('Product Controller', () => {
  let controller: BackofficeProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackofficeProductController],
    }).compile();

    controller = module.get<BackofficeProductController>(BackofficeProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
