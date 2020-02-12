import { Test, TestingModule } from '@nestjs/testing';
import { CommentClientController } from './comment-client.controller';

describe('CommentClient Controller', () => {
  let controller: CommentClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentClientController],
    }).compile();

    controller = module.get<CommentClientController>(CommentClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
