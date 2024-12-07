import { IsNumber, IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class FrontQuizSetDto {
    @IsNumber()
    setID: number;

    @IsString()
    title: string;

    @IsString()
    creator: string;

    @IsBoolean()
    public: boolean;

    @IsString()
    @IsOptional()
    university: string | null;

    @IsString()
    @IsOptional()
    department: string | null;

    @IsString()
    @IsOptional()
    subject: string | null;

    @IsString()
    @IsOptional()
    book: string | null;

    @IsString()
    quizType: string;

    @IsArray()
    @IsString({ each: true })
    sharedWith: string[];

    @IsNumber()
    cnt: number;

    @IsString()
    @IsOptional()
    lastAttemptDate: string | null;
}