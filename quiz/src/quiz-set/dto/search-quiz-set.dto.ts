import { IsString, IsOptional } from 'class-validator';

export class SearchQuizSetDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}