import { Test, TestingModule } from '@nestjs/testing';
import { GetnetController } from './getnet.controller';

describe('Getnet Controller', () => {
  let controller: GetnetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetnetController],
    }).compile();

    controller = module.get<GetnetController>(GetnetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
