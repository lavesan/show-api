import { Test, TestingModule } from '@nestjs/testing';
import { BackofficeUserController } from './backoffice-user.controller';

describe('User Controller', () => {
  let controller: BackofficeUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackofficeUserController],
    }).compile();

    controller = module.get<BackofficeUserController>(BackofficeUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
