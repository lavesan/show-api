import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledTimeService } from './scheduled-time.service';

describe('ScheduledTimeService', () => {
  let service: ScheduledTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledTimeService],
    }).compile();

    service = module.get<ScheduledTimeService>(ScheduledTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
