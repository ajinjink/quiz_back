import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSet } from './entities/quiz-set.entity';
import { QuizSetRepository } from './repositories/quiz-set.repository';
import { QuizSetShareRepository } from './repositories/quiz-set-share.repository';
import { ShortAnswerQuiz } from 'src/quiz-types/short-answer-quiz/short-answer-quiz.entity';
import { ShortAnswerQuizRepository } from 'src/quiz-types/short-answer-quiz/short-answer-quiz.repository';
import { QuizSetController } from './quiz-set.controller';
import { QuizSetService } from './quiz-set.service';
import { UsersModule } from 'src/users/users.module';
import { QuizAttemptHistory } from './entities/quiz-attempt-history.entity';
import { QuizAttemptHistoryRepository } from './repositories/quiz-attempt-history.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([QuizSet, ShortAnswerQuiz, QuizAttemptHistory]),
        UsersModule
    ],
    controllers: [QuizSetController],
    providers: [
        QuizSetService, 
        QuizSetRepository,
        QuizSetShareRepository,
        ShortAnswerQuizRepository,
        QuizAttemptHistoryRepository
    ],
    exports: [QuizSetService],
})
export class QuizSetModule {}