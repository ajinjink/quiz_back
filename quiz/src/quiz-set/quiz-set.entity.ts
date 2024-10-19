import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ShortAnswerQuiz } from '../short-answer-quiz/short-answer-quiz.entity';

@Entity()
export class QuizSet {
  @PrimaryGeneratedColumn()
  setID: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column()
  public: boolean;

  @Column()
  quizType: string;

  @Column('simple-array')
  sharedList: string[];

  @Column({ default: 0 })
  cnt: number;

  @OneToMany(() => ShortAnswerQuiz, shortAnswer => shortAnswer.quizSet)
  shortAnswers: ShortAnswerQuiz[];
}