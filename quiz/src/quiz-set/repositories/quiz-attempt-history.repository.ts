import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuizAttemptHistory } from '../entities/quiz-attempt-history.entity';

@Injectable()
export class QuizAttemptHistoryRepository extends Repository<QuizAttemptHistory> {
  constructor(private dataSource: DataSource) {
    super(QuizAttemptHistory, dataSource.createEntityManager());
  }

  async updateAttemptHistory(userId: string, quizSetId: string): Promise<QuizAttemptHistory> {
    let attempt = await this.findOne({
      where: { userId, quizSetId }
    });

    if (!attempt) {
      attempt = this.create({
        userId,
        quizSetId,
      });
    }
    
    attempt.lastAttemptDate = new Date();
    return this.save(attempt);
  }

  async getAttemptsByUserId(userId: string): Promise<QuizAttemptHistory[]> {
    return this.find({
      where: { userId },
      relations: ['quizSet']
    });
  }
}