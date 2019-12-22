import { Test, TestingModule } from '@nestjs/testing';
import { UserBackofficeService } from './user-backoffice.service';

describe('UserBackofficeService', () => {
  let service: UserBackofficeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBackofficeService],
    }).compile();

    service = module.get<UserBackofficeService>(UserBackofficeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
