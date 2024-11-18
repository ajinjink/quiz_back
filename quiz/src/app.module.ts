import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { QuizSetModule } from './quiz-set/quiz-set.module';
import { ShortAnswerQuizModule } from './quiz-types/short-answer-quiz/short-answer-quiz.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { QuizSet } from './quiz-set/entities/quiz-set.entity';
import { ShortAnswerQuiz } from './quiz-types/short-answer-quiz/short-answer-quiz.entity';
import { QuizAttemptHistory } from './quiz-set/entities/quiz-attempt-history.entity';
import { EvaluateModule } from './evaluate/evaluate.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
	  useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
          inject: [ConfigService],
        }),
        UsersModule,
	QuizSetModule,
	ShortAnswerQuizModule,
	EvaluateModule,
	AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
