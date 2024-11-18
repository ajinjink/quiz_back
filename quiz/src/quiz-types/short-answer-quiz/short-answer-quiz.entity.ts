import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QuizSet } from './../../quiz-set/entities/quiz-set.entity';

@Entity()
export class ShortAnswerQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  no: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @ManyToOne(() => QuizSet, quizSet => quizSet.shortAnswers)
  @JoinColumn({ name: 'quizSetID' })
  quizSet: QuizSet;

  @Column()
  quizSetID: string;
}