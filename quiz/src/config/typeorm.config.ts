import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/users.entity';
import { QuizSet } from '../quiz-set/entities/quiz-set.entity';
import { QuizSetShare } from '../quiz-set/entities/quiz-set-share.entity';
import { ShortAnswerQuiz } from '../quiz-types/short-answer-quiz/short-answer-quiz.entity';
import { QuizAttemptHistory } from '../quiz-set/entities/quiz-attempt-history.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User, QuizSet, QuizSetShare, ShortAnswerQuiz, QuizAttemptHistory],
    synchronize: configService.get('NODE_ENV') !== 'production',
});
