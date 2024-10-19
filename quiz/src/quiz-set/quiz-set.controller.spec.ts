import { Test, TestingModule } from '@nestjs/testing';
import { QuizSetController } from './quiz-set.controller';

describe('QuizSetController', () => {
  let controller: QuizSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizSetController],
    }).compile();

    controller = module.get<QuizSetController>(QuizSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
