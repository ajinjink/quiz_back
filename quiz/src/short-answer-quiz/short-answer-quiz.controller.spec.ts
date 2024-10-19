import { Test, TestingModule } from '@nestjs/testing';
import { ShortAnswerQuizController } from './short-answer-quiz.controller';

describe('ShortAnswerQuizController', () => {
  let controller: ShortAnswerQuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortAnswerQuizController],
    }).compile();

    controller = module.get<ShortAnswerQuizController>(ShortAnswerQuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
