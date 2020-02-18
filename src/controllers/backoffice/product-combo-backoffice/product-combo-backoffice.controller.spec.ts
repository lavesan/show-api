import { Test, TestingModule } from '@nestjs/testing';
import { ProductComboBackofficeController } from './product-combo-backoffice.controller';

describe('ProductComboBackoffice Controller', () => {
  let controller: ProductComboBackofficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductComboBackofficeController],
    }).compile();

    controller = module.get<ProductComboBackofficeController>(ProductComboBackofficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
