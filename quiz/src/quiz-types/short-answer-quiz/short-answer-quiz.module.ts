import { Module } from '@nestjs/common';
import { ShortAnswerQuizController } from './short-answer-quiz.controller';
import { ShortAnswerQuizService } from './short-answer-quiz.service';

@Module({
  controllers: [ShortAnswerQuizController],
  providers: [ShortAnswerQuizService]
})
export class ShortAnswerQuizModule {}
