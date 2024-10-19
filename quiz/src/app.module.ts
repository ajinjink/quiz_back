import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { QuizSetModule } from './quiz-set/quiz-set.module';
import { ShortAnswerQuizModule } from './short-answer-quiz/short-answer-quiz.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { QuizSet } from './quiz-set/quiz-set.entity';
import { ShortAnswerQuiz } from './short-answer-quiz/short-answer-quiz.entity';
import { EvaluateModule } from './evaluate/evaluate.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: 'localhost',
              port: 5432,
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME'),
              entities: [User, QuizSet, ShortAnswerQuiz],
              synchronize: configService.get('NODE_ENV') !== 'production',
          }),
          inject: [ConfigService],
        }),
        UsersModule, QuizSetModule, ShortAnswerQuizModule, EvaluateModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
