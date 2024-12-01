import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizSetRepository } from './repositories/quiz-set.repository';
import { QuizSetShareRepository } from './repositories/quiz-set-share.repository';
import { ShortAnswerQuizRepository } from '../quiz-types/short-answer-quiz/short-answer-quiz.repository';
import { CreateQuizSetDto } from './dto/create-quiz-set.dto';
import { QuizSet } from './entities/quiz-set.entity';
import { ShortAnswerQuiz } from '../quiz-types/short-answer-quiz/short-answer-quiz.entity';
import { UsersService } from './../users/users.service';
import { UpdateQuizSetDto } from './dto/update-quiz-set.dto';
import { QuizAttemptHistoryRepository } from './repositories/quiz-attempt-history.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class QuizSetService {
  private readonly logger = new Logger(QuizSetService.name);

  constructor(
    private quizSetRepository: QuizSetRepository,
    private quizSetShareRepository: QuizSetShareRepository,
    private shortAnswerQuizRepository: ShortAnswerQuizRepository,
    private usersService: UsersService,
    private quizAttemptHistoryRepository: QuizAttemptHistoryRepository,
    private dataSource: DataSource
  ) {}

  async createQuizSet(createQuizSetDto: CreateQuizSetDto, creatorId: string): Promise<QuizSet> {
    const { title, public: isPublic, subject, book, quizType, questions } = createQuizSetDto;
    const user = await this.usersService.getUserById(creatorId);
    const university = user.university;

    // Create QuizSet
    const newQuizSet = this.quizSetRepository.create({
      title,
      creatorId,
      public: isPublic,
      university,
      subject,
      book,
      quizType,
      cnt: 0
    });
    const savedQuizSet = await this.quizSetRepository.save(newQuizSet);

    // If quizType is short_answers, create ShortAnswerQuiz entries
    if (quizType === 'short_answers') {
      const shortAnswerQuizzes = questions.map(q => ({
        quizSetID: savedQuizSet.setID,
        no: q.no,
        question: q.question,
        answer: q.answer
      }));

      await this.shortAnswerQuizRepository.createMany(shortAnswerQuizzes);
    }
    
    console.log(savedQuizSet);
    return savedQuizSet;
  }

  async getCreatedQuizSets(userId: string): Promise<any[]> {
    const quizSets = await this.quizSetRepository.find({
      where: { creatorId: userId },
      order: { setID: 'DESC' },
      relations: ['shares', 'shares.user'],
      select: {
        setID: true,
        title: true,
        public: true,
        quizType: true,
        cnt: true,
        university: true,
        subject: true,
        book: true,
        shares: {
          userId: true,
          user: {
            userID: true,
            username: true,
            email: true
          }
        }
      }
    });

    const attempts = await this.quizAttemptHistoryRepository.getAttemptsByUserId(userId);
    const attemptMap = new Map(attempts.map(attempt => [attempt.quizSetId, attempt.lastAttemptDate]));

    return quizSets.map(quizSet => ({
      ...quizSet,
      lastAttemptDate: attemptMap.get(quizSet.setID) || null,
      sharedWith: quizSet.shares?.map(share => ({
        userId: share.user.userID,
        username: share.user.username,
        email: share.user.email
      })) || []
    }));
  }

  async getSharedQuizSets(userId: string): Promise<QuizSet[]> {
    const shares = await this.quizSetShareRepository.find({
      where: { userId },
      relations: ['quizSet'],
      order: { quizSet: { setID: 'DESC' }}
    });

    const attempts = await this.quizAttemptHistoryRepository.getAttemptsByUserId(userId);
    const attemptMap = new Map(attempts.map(attempt => [attempt.quizSetId, attempt.lastAttemptDate]));

    return shares.map(share => ({
      ...share.quizSet,
      lastAttemptDate: attemptMap.get(share.quizSet.setID) || null
    }));
  }

  async getQuizProblemsBySetId(setId: string): Promise<ShortAnswerQuiz[] | any[]> {
    const quizSet = await this.quizSetRepository.findOne({ where: { setID: setId } });
    if (!quizSet) {
      throw new NotFoundException(`Quiz set with ID ${setId} not found`);
    }

    switch (quizSet.quizType) {
      case 'short_answers':
        return this.shortAnswerQuizRepository.find({ where: { quizSetID: setId } });
      // 다른 퀴즈 타입
      default:
        throw new NotFoundException(`Unsupported quiz type: ${quizSet.quizType}`);
    }
  }

  async getQuizSetById(setId: string): Promise<QuizSet> {
    const quizSet = await this.quizSetRepository.findOne({
      where: { setID: setId },
      relations: ['shortAnswers']
    });
    if (!quizSet) {
      throw new NotFoundException(`Quiz set with ID ${setId} not found`);
    }
    return quizSet;
  }

  async updateQuizSet(setId: string, updateQuizSetDto: UpdateQuizSetDto): Promise<QuizSet> {
    try {
      const quizSet = await this.getQuizSetById(setId);
      if (!quizSet) {
        throw new NotFoundException(`Quiz set with ID ${setId} not found`);
      }

      // Update quiz set properties
      Object.assign(quizSet, updateQuizSetDto);

      // Save the updated quiz set
      const updatedQuizSet = await this.quizSetRepository.save(quizSet);

      // Update questions if provided
      if (updateQuizSetDto.questions && updateQuizSetDto.questions.length > 0) {
        // Delete existing questions
        await this.shortAnswerQuizRepository.delete({ quizSetID: updatedQuizSet.setID });

        // Create new questions
        const newQuestions = updateQuizSetDto.questions.map(q => 
          this.shortAnswerQuizRepository.create({
            ...q,
            quizSetID: updatedQuizSet.setID
          })
        );

        // Save new questions
        await this.shortAnswerQuizRepository.save(newQuestions);
      }

      // Fetch and return the updated quiz set with its related questions
      return this.getQuizSetById(setId);
    } catch (error) {
      this.logger.error(`Failed to update quiz set: ${error.message}`, error.stack);
      throw error;
    }
  }

  async shareQuizSet(quizSetId: string, creatorId: string, recipientId: string): Promise<void> {
    const quizSet = await this.quizSetRepository.findOne({ where: { setID: quizSetId } });
    
    if (!quizSet) {
      throw new NotFoundException('Quiz set not found');
    }

    if (quizSet.creatorId !== creatorId) {
      throw new ForbiddenException('Only the creator can share this quiz set');
    }

    // Check if already shared
    const existingShare = await this.quizSetShareRepository.findOne({
      where: { userId: recipientId, quizSetId }
    });

    if (existingShare) {
      throw new ForbiddenException('This quiz set is already shared with the user');
    }

    // Create new share
    await this.quizSetShareRepository.shareQuizSet(recipientId, quizSetId);
  }

  async unshareQuizSet(quizSetId: string, username: string, requestUserId: string): Promise<void> {
    // 1. 퀴즈셋 확인
    const quizSet = await this.quizSetRepository.findOne({ 
        where: { setID: quizSetId } 
    });
    
    if (!quizSet) {
        throw new NotFoundException('Quiz set not found');
    }

    // 2. 요청한 사용자가 퀴즈셋의 생성자인지 확인
    if (quizSet.creatorId !== requestUserId) {
        throw new ForbiddenException('Only the creator can unshare this quiz set');
    }

    // 3. username으로 대상 사용자 찾기
    const targetUser = await this.usersService.getUserByUsername(username);
    if (!targetUser) {
        throw new NotFoundException(`User ${username} not found`);
    }

    // 4. 공유 기록 있는지 확인
    const share = await this.quizSetShareRepository.findOne({
        where: {
            userId: targetUser.userID,
            quizSetId
        }
    });

    if (!share) {
        throw new NotFoundException(`Quiz set is not shared with user ${username}`);
    }

    // 5. 공유 제거
    await this.quizSetShareRepository.delete({
        userId: targetUser.userID,
        quizSetId
    });
}

  async deleteQuizSet(setId: string, userId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const quizSet = await this.quizSetRepository.findOne({ where: { setID: setId } });
      
      if (!quizSet) {
        throw new NotFoundException('Quiz set not found');
      }
  
      if (quizSet.creatorId !== userId) {
        throw new ForbiddenException('Only the creator can delete this quiz set');
      }

      // Delete all attempt histories first
      await queryRunner.manager.delete('quiz_attempt_history', { quizSetId: setId });

      // Delete all shares
      await queryRunner.manager.delete('quiz_set_share', { quizSetId: setId });

      // Delete associated short answer quizzes if applicable
      if (quizSet.quizType === 'short_answers') {
        await queryRunner.manager.delete('short_answer_quiz', { quizSetID: setId });
      }

      // Finally, delete the quiz set itself
      await queryRunner.manager.remove('quiz_set', quizSet);

      // Commit the transaction
      await queryRunner.commitTransaction();

    } catch (error) {
      // If we encounter any error, rollback the changes
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to delete quiz set: ${error.message}`, error.stack);
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async hasAccess(userId: string, quizSetId: string): Promise<boolean> {
    const quizSet = await this.quizSetRepository.findOne({ where: { setID: quizSetId } });
    
    if (!quizSet) {
      return false;
    }

    if (quizSet.public) {
      return true;
    }

    if (quizSet.creatorId === userId) {
      return true;
    }

    const share = await this.quizSetShareRepository.findOne({
      where: { userId, quizSetId }
    });

    return !!share;
  }

  async incrementQuizSetCount(setId: string, userId: string): Promise<QuizSet> {
    const quizSet = await this.quizSetRepository.findOne({ where: { setID: setId } });

    if (!quizSet) {
      throw new NotFoundException(`Quiz set with ID ${setId} not found`);
    }

    if (!quizSet.public) {
      const hasAccess = await this.hasAccess(userId, setId);
      if (!hasAccess) {
        throw new ForbiddenException('You do not have permission to access this quiz set');
      }
    }

    await this.quizAttemptHistoryRepository.updateAttemptHistory(userId, setId);

    quizSet.cnt += 1;
    return this.quizSetRepository.save(quizSet);
  }
}