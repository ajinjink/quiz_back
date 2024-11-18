import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/users.entity';
import { QuizSet } from './quiz-set.entity';

@Entity()
export class QuizAttemptHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  quizSetId: string;

  @CreateDateColumn()
  lastAttemptDate: Date;

  @ManyToOne(() => User, user => user.quizAttempts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => QuizSet, quizSet => quizSet.attempts)
  @JoinColumn({ name: 'quizSetId' })
  quizSet: QuizSet;
}