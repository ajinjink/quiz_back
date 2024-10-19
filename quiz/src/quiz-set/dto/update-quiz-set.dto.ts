import { IsString, IsBoolean, IsArray, IsNumber, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum QuizType {
  SHORT_ANSWERS = 'short_answers',
  // other quiz types
}

export class QuestionDto {
  @IsNumber()
  no: number;

  @IsString()
  question: string;

  @IsString()
  answer: string;
}

export class UpdateQuizSetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @IsOptional()
  @IsEnum(QuizType)
  quizType?: QuizType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}