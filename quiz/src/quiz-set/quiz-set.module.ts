import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSet } from './quiz-set.entity';
import { QuizSetRepository } from './quiz-set.repository';
import { ShortAnswerQuiz } from '../short-answer-quiz/short-answer-quiz.entity';
import { ShortAnswerQuizRepository } from '../short-answer-quiz/short-answer-quiz.repository';
import { QuizSetController } from './quiz-set.controller';
import { QuizSetService } from './quiz-set.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([QuizSet, ShortAnswerQuiz]),
        UsersModule
    ],
    controllers: [QuizSetController],
    providers: [QuizSetService, QuizSetRepository, ShortAnswerQuizRepository],
    exports: [QuizSetService],
})
export class QuizSetModule {}