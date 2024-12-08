import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { QuizSetModule } from './quiz-set/quiz-set.module';
import { ShortAnswerQuizModule } from './quiz-types/short-answer-quiz/short-answer-quiz.module';
import { EvaluateModule } from './evaluate/evaluate.module';
import { AuthModule } from './auth/auth.module';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            cache: true,
            expandVariables: true,
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
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
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}