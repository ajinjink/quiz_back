import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuizSet } from '../entities/quiz-set.entity';

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

  async findQuizSetById(setID: string): Promise<QuizSet | null> {
    return this.findOne({ 
      where: { setID },
      relations: ['creator', 'shares', 'shortAnswers'] 
    });
  }

  async findQuizSetsByCreator(creatorId: string): Promise<QuizSet[]> {
    return this.find({ 
      where: { creatorId },
      relations: ['creator']
    });
  }

  async findPublicQuizSets(): Promise<QuizSet[]> {
    return this.find({ 
      where: { public: true },
      relations: ['creator']
    });
  }

}
