import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledTimeController } from './scheduled-time.controller';

describe('ScheduledTime Controller', () => {
  let controller: ScheduledTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledTimeController],
    }).compile();

    controller = module.get<ScheduledTimeController>(ScheduledTimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
