import { Test, TestingModule } from '@nestjs/testing';
import { CommentBackofficeController } from './comment-backoffice.controller';

describe('CommentBackoffice Controller', () => {
  let controller: CommentBackofficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentBackofficeController],
    }).compile();

    controller = module.get<CommentBackofficeController>(CommentBackofficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
