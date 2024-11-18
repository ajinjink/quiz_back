import { Test, TestingModule } from '@nestjs/testing';
import { ShortAnswerQuizService } from './short-answer-quiz.service';

describe('ShortAnswerQuizService', () => {
  let service: ShortAnswerQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortAnswerQuizService],
    }).compile();

    service = module.get<ShortAnswerQuizService>(ShortAnswerQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
