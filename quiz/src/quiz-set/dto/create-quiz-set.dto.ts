import { IsString, IsBoolean, IsArray, IsNumber, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

enum QuizType {
  SHORT_ANSWERS = 'short_answers',
  TF = 'TF',
  ESSAY = 'essay',
  MULTIPLE_CHOICE = 'multiplechoice'
}

class QuestionDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsNumber()
  no: number;
}

export class CreateQuizSetDto {
  @IsString()
  title: string;

  @IsBoolean()
  public: boolean;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  book: string | null;

  @IsEnum(QuizType)
  quizType: QuizType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}