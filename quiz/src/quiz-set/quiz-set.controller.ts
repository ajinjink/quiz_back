import { Controller, Get, Param, Post, Put, Patch, Delete, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuizSetService } from './quiz-set.service';
import { CreateQuizSetDto } from './dto/create-quiz-set.dto';
import { UpdateQuizSetDto } from './dto/update-quiz-set.dto';
import { User } from 'src/users/users.entity';
import { GetUser } from './../auth/decorators/get-user.decorator';

@Controller('quiz')
@UseGuards(AuthGuard('jwt'))
export class QuizSetController {
    constructor(private readonly quizSetService: QuizSetService) {}


    @Post()
    async createQuizSet(@Body() createQuizSetDto: CreateQuizSetDto, @GetUser() user: User) {
        return this.quizSetService.createQuizSet(createQuizSetDto, user.userID);
    }

    @Get('created')
    async getCreatedQuizSets(@GetUser() user: User) {
        return this.quizSetService.getCreatedQuizSets(user.userID);
    }

    @Get('shared')
    async getSharedQuizSets(@GetUser() user: User) {
        return this.quizSetService.getSharedQuizSets(user.userID);
    }

    @Get(':id')
    async getQuizProblemsBySetId(@Param('id') id: string, @GetUser() user: User) {
        const hasAccess = await this.quizSetService.hasAccess(user.userID, id);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have permission to access this quiz set');
        }
        return this.quizSetService.getQuizProblemsBySetId(id);
    }

    @Put(':id')
    async updateQuizSet(@Param('id') id: string, @Body() updateQuizSetDto: UpdateQuizSetDto, @GetUser() user: User) {
        const quizSet = await this.quizSetService.getQuizSetById(id);
        if (quizSet.creatorId !== user.userID) {
            throw new ForbiddenException('Only the creator can update this quiz set');
        }
        return this.quizSetService.updateQuizSet(id, updateQuizSetDto);
    }

    @Post(':id/share')
    async shareQuizSet(
        @Param('id') quizSetId: string,
        @Body('recipientId') recipientId: string,
        @GetUser() user: User
    ) {
        await this.quizSetService.shareQuizSet(quizSetId, user.userID, recipientId);
        return { message: 'Quiz set shared successfully' };
    }

    @Delete(':id/share')
    async unshareQuizSet(
        @Param('id') quizSetId: string,
        @Body('username') username: string,
        @GetUser() user: User
    ) {
        await this.quizSetService.unshareQuizSet(quizSetId, username, user.userID);
        return { message: 'Quiz set sharing removed successfully' };
    }

    @Delete(':id')
    async deleteQuizSet(
        @Param('id') quizSetId: string,
        @GetUser() user: User
    ) {
        await this.quizSetService.deleteQuizSet(quizSetId, user.userID);
        return { message: 'Quiz set successfully deleted' };
    }

    @Patch(':id/increment-count')
    async incrementQuizSetCount(@Param('id') id: string, @GetUser() user: User) {
        return this.quizSetService.incrementQuizSetCount(id, user.userID);
    }
}



