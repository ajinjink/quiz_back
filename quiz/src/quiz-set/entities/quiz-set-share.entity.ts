import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from 'src/users/users.entity';
import { QuizSet } from './quiz-set.entity';

@Entity()
export class QuizSetShare {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  quizSetId: string;

  @ManyToOne(() => User, user => user.sharedQuizSets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => QuizSet, quizSet => quizSet.shares)
  @JoinColumn({ name: 'quizSetId' })
  quizSet: QuizSet;
}