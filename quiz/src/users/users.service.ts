import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async signup(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, email } = createUserDto;

        const existingUser = await this.usersRepository.findOne({ where: [{ username }, { email }] });
        if (existingUser) {
            throw new ConflictException('Username or email already exists');
        }

        const hashedPassword = await this.hashPassword(password);

        const user = this.usersRepository.create({
            username,
            password: hashedPassword,
            email,
            createdList: [],
            sharedList: [],
        });

        return this.usersRepository.save(user);
    }

    async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
        const { username, password } = loginUserDto;
        const user = await this.usersRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: user.username, sub: user.userID };
        return {
            accessToken: this.jwtService.sign(payload),
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

    async getUserById(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userID: userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
    }

    async addCreatedQuizSet(userId: string, quizSetId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userID: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        user.createdList = [...user.createdList, quizSetId];
        return this.usersRepository.save(user);
    }

    async addSharedQuizSet(userId: string, quizSetId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userID: userId } });
        
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        if (!user.sharedList.includes(quizSetId)) {
            user.sharedList = [...user.sharedList, quizSetId];
            return this.usersRepository.save(user);
        }
    
        return user;
    }

    async removeCreatedQuizSet(userId: string, quizSetId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userID: userId } });
        
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        user.createdList = user.createdList.filter(id => id !== quizSetId);
        return this.usersRepository.save(user);
    }
  
    async removeSharedQuizSet(userId: string, quizSetId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userID: userId } });
        
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        user.sharedList = user.sharedList.filter(id => id !== quizSetId);
        return this.usersRepository.save(user);
    }

}