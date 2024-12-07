import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ShortAnswerQuiz } from '../../quiz-types/short-answer-quiz/short-answer-quiz.entity';
import { User } from '../../users/users.entity';
import { QuizSetShare } from './quiz-set-share.entity';
import { QuizAttemptHistory } from './quiz-attempt-history.entity';

@Entity()
export class QuizSet {
  @PrimaryGeneratedColumn()
  setID: string;

  @Column()
  title: string;

  @ManyToOne(() => User, user => user.createdQuizSets)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @Column()
  public: boolean;

  @Column({nullable: true})
  university: string;

  @Column({nullable: true})
  department: string;

  @Column()
  subject: string;

  @Column({nullable: true})
  book: string;

  @Column()
  quizType: string;

  @Column({ default: 0 })
  cnt: number;

  @OneToMany(() => ShortAnswerQuiz, shortAnswer => shortAnswer.quizSet)
  shortAnswers: ShortAnswerQuiz[];

  @OneToMany(() => QuizSetShare, share => share.quizSet)
  shares: QuizSetShare[];

  @OneToMany(() => QuizAttemptHistory, attempt => attempt.quizSet)
  attempts: QuizAttemptHistory[];
}