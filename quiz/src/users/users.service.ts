import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private authService: AuthService,
        private dataSource: DataSource
    ) {}

    async signup(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, email, university, department } = createUserDto;

        const existingUser = await this.usersRepository.findOne({ where: [{ username }, { email }] });
        if (existingUser) {
            throw new ConflictException('Username or email already exists');
        }

        const hashedPassword = await this.hashPassword(password);

        const user = this.usersRepository.create({
            username,
            password: hashedPassword,
            email,
            university,
            department
        });

        return this.usersRepository.save(user);
    }

    async login(loginUserDto: LoginUserDto) {
        const { username, password } = loginUserDto;
        const user = await this.usersRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.authService.generateTokens(user);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                userID: user.userID,
                username: user.username,
                email: user.email,
                university: user.university,
                department: user.department
            }
        };
    }

    private async hashPassword(password: string): Promise<string> {
          const saltRounds = 10;
          const salt = await bcrypt.genSalt(saltRounds);
          return bcrypt.hash(password, salt);
    }
  
    private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
          return bcrypt.compare(plainTextPassword, hashedPassword);
    }

    async checkUsernameExists(username: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { username } });
        return !!user;
    }

    async checkEmailExists(email: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { email } });
        return !!user;
    }

    async getUserById(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userID: userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { username: username } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
    }

    async withdrawUser(userId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.usersRepository.findOne({ 
                where: { userID: userId },
                relations: ['createdQuizSets']
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            await queryRunner.manager.delete('quiz_attempt_history', [
                { userId },
                { quizSetId: In(user.createdQuizSets.map(set => set.setID)) }
            ]);

            await queryRunner.manager.delete('quiz_set_share', [
                { userId },
                { quizSetId: In(user.createdQuizSets.map(set => set.setID)) }
            ]);

            await queryRunner.manager.delete('short_answer_quiz', {
                quizSetID: In(user.createdQuizSets.map(set => set.setID))
            });

            await queryRunner.manager.delete('quiz_set', {
                creatorId: userId
            });

            await queryRunner.manager.delete('users', { userID: userId });

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}