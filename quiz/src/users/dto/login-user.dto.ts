import { IsString, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserProfileDto {
    @Expose()
    userID: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    university: string;

    @Expose()
    department: string;

    constructor(partial: Partial<UserProfileDto>) {
        Object.assign(this, partial);
    }
}

export class LoginResponseDto {
    @Expose()
    accessToken: string;

    @Expose()
    user: UserProfileDto;

    constructor(partial: Partial<LoginResponseDto>) {
        if (partial && partial.user) {
            this.user = new UserProfileDto(partial.user);
        }
        this.accessToken = partial.accessToken;
    }
}