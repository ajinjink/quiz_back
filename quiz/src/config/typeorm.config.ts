import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/users.entity';
import { QuizSet } from '../quiz-set/quiz-set.entity';
import { ShortAnswerQuiz } from '../short-answer-quiz/short-answer-quiz.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User, QuizSet, ShortAnswerQuiz],
    synchronize: configService.get('NODE_ENV') !== 'production',
});
