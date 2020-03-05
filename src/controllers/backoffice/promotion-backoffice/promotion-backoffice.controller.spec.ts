import { Test, TestingModule } from '@nestjs/testing';
import { PromotionBackofficeController } from './promotion-backoffice.controller';

describe('Promotion Controller', () => {
  let controller: PromotionBackofficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionBackofficeController],
    }).compile();

    controller = module.get<PromotionBackofficeController>(PromotionBackofficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
