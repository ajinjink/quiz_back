import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsEmail()
    email: string;
}


export class CreateUserResponseDto {
    username: string;

    @Exclude()
    password: string;

    email: string;

    constructor(partial: Partial<CreateUserResponseDto>) {
        Object.assign(this, partial);
    }
}