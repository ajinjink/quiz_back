import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuizSet } from './quiz-set.entity';

@Injectable()
export class QuizSetRepository extends Repository<QuizSet> {
  constructor(private dataSource: DataSource) {
    super(QuizSet, dataSource.createEntityManager());
  }
  
  async createQuizSet(quizSetData: Partial<QuizSet>): Promise<QuizSet> {
    const quizSet = this.create(quizSetData);
    return await this.save(quizSet);
  }

  async updateQuizSet(quizSet: QuizSet): Promise<QuizSet> {
    return this.save(quizSet);
  }

  async findQuizSetById(setID: string): Promise<QuizSet> {
    return this.findOne({ where: { setID } });
  }

  async findQuizSetsByCreator(creatorId: string): Promise<QuizSet[]> {
    return this.find({ where: { creator: creatorId } });
  }

  async findPublicQuizSets(): Promise<QuizSet[]> {
    return this.find({ where: { public: true } });
  }

}
