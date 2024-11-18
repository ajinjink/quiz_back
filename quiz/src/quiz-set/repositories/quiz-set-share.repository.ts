import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuizSetShare } from '../entities/quiz-set-share.entity';

@Injectable()
export class QuizSetShareRepository extends Repository<QuizSetShare> {
  constructor(private dataSource: DataSource) {
    super(QuizSetShare, dataSource.createEntityManager());
  }

  async shareQuizSet(userId: string, quizSetId: string): Promise<QuizSetShare> {
    const share = this.create({
      userId,
      quizSetId,
    });
    return this.save(share);
  }

  async unshareQuizSet(userId: string, quizSetId: string): Promise<void> {
    await this.delete({ userId, quizSetId });
  }

  async findUserShares(userId: string): Promise<QuizSetShare[]> {
    return this.find({
      where: { userId },
      relations: ['quizSet'],
    });
  }
}