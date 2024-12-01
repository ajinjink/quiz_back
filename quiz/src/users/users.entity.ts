import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { QuizSet } from '../quiz-set/entities/quiz-set.entity';
import { QuizSetShare } from '../quiz-set/entities/quiz-set-share.entity';
import { QuizAttemptHistory } from '../quiz-set/entities/quiz-attempt-history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  university: string;

  @Column()
  department: string;

  @OneToMany(() => QuizSet, quizSet => quizSet.creator)
  createdQuizSets: QuizSet[];

  @OneToMany(() => QuizSetShare, share => share.user)
  sharedQuizSets: QuizSetShare[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QuizAttemptHistory, attempt => attempt.user)
  quizAttempts: QuizAttemptHistory[];

  }