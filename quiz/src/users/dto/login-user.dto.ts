import { IsString, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginUserResponseDto {
    username: string;

    @Exclude()
    password: string;

    constructor(partial: Partial<LoginUserResponseDto>) {
        Object.assign(this, partial);
    }
}