import { Test, TestingModule } from '@nestjs/testing';
import { UserBackofficeController } from './user-backoffice.controller';

describe('UserBackoffice Controller', () => {
  let controller: UserBackofficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBackofficeController],
    }).compile();

    controller = module.get<UserBackofficeController>(UserBackofficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
