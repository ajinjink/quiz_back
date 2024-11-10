import { DataSource, DataSourceOptions } from "typeorm"
import { ConfigService } from '@nestjs/config'
import { User } from './users/users.entity'
import { QuizSet } from './quiz-set/quiz-set.entity'
import { ShortAnswerQuiz } from './short-answer-quiz/short-answer-quiz.entity'
import * as dotenv from 'dotenv'

dotenv.config()

const configService = new ConfigService()

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User, QuizSet, ShortAnswerQuiz],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations"
}

export const AppDataSource = new DataSource(dataSourceOptions)
