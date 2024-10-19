import { IsString, IsNotEmpty } from 'class-validator';

export class EvaluateDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  user_answer: string;
}