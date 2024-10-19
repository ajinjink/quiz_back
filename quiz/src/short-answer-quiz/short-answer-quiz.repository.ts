import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ShortAnswerQuiz } from './short-answer-quiz.entity';

@Injectable()
export class ShortAnswerQuizRepository extends Repository<ShortAnswerQuiz> {
  constructor(private dataSource: DataSource) {
    super(ShortAnswerQuiz, dataSource.createEntityManager());
  }

  async createMany(shortAnswerQuizzes: Partial<ShortAnswerQuiz>[]): Promise<ShortAnswerQuiz[]> {
    const quizzes = this.create(shortAnswerQuizzes);
    return await this.save(quizzes);
  }

  // ... (기타 메서드들)
}