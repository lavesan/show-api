import { Test, TestingModule } from '@nestjs/testing';
import { GetnetService } from './getnet.service';

describe('GetnetService', () => {
  let service: GetnetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetnetService],
    }).compile();

    service = module.get<GetnetService>(GetnetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
