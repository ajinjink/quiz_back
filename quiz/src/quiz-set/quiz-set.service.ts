import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizSetRepository } from './quiz-set.repository';
import { ShortAnswerQuizRepository } from '../short-answer-quiz/short-answer-quiz.repository';
import { CreateQuizSetDto } from './dto/create-quiz-set.dto';
import { QuizSet } from './quiz-set.entity';
import { ShortAnswerQuiz } from './../short-answer-quiz/short-answer-quiz.entity';
import { UsersService } from './../users/users.service';
import { UpdateQuizSetDto } from './dto/update-quiz-set.dto';
import { In } from 'typeorm';


@Injectable()
export class QuizSetService {
  private readonly logger = new Logger(QuizSetService.name);

  constructor(
    private quizSetRepository: QuizSetRepository,
    private shortAnswerQuizRepository: ShortAnswerQuizRepository,
    private usersService: UsersService,
  ) {}

  async createQuizSet(createQuizSetDto: CreateQuizSetDto, creatorId: string): Promise<QuizSet> {
    const { title, public: isPublic, quizType, questions } = createQuizSetDto;

    // Create QuizSet
    const newQuizSet = this.quizSetRepository.create({
      title,
      creator: creatorId,
      public: isPublic,
      quizType,
      sharedList: [],
      cnt: 0
    });
    const quizSet = await this.quizSetRepository.save(newQuizSet);
    console.log(quizSet);

    // If quizType is short_answers, create ShortAnswerQuiz entries
    if (quizType === 'short_answers') {
      const shortAnswerQuizzes = questions.map(q => ({
        quizSetID: quizSet.setID,
        no: q.no,
        question: q.question,
        answer: q.answer
      }));

      await this.shortAnswerQuizRepository.createMany(shortAnswerQuizzes);
    }

    await this.usersService.addCreatedQuizSet(creatorId, quizSet.setID);

    return quizSet;
  }

  async getCreatedQuizSets(userId: string): Promise<QuizSet[]> {
    const user = await this.usersService.getUserById(userId);

    if (!user.createdList || user.createdList.length === 0) {
      return []; 
    }

    const quizSets = await this.quizSetRepository.find({
      where: { setID: In(user.createdList) },
      order: { setID: 'DESC' } // 최신 순으로 정렬
    });

    if (!quizSets || quizSets.length === 0) {
      throw new NotFoundException('No quiz sets found for this user');
    }

    return quizSets;
  }

  async getSharedQuizSets(userId: string): Promise<QuizSet[]> {
    const user = await this.usersService.getUserById(userId);

    if (!user.sharedList || user.sharedList.length === 0) {
      return []; // 공유받은 퀴즈 셋이 없는 경우 빈 배열 반환
    }

    const sharedQuizSets = await this.quizSetRepository.find({
      where: { setID: In(user.sharedList) },
      order: { setID: 'DESC' } // 최신 순으로 정렬
    });

    return sharedQuizSets;
  }

  async getQuizzesBySetId(setId: string): Promise<ShortAnswerQuiz[] | any[]> {
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

  async shareQuizSet(quizSetId: string, creatorId: string, recipientId: string): Promise<QuizSet> {
    const quizSet = await this.quizSetRepository.findOne({ where: { setID: quizSetId } });
    
    if (!quizSet) {
      throw new NotFoundException('Quiz set not found');
    }

    if (quizSet.creator !== creatorId) {
      throw new ForbiddenException('Only the creator can share this quiz set');
    }

    if (quizSet.sharedList.includes(recipientId)) {
      throw new ForbiddenException('This quiz set is already shared with the user');
    }

    // Update quiz set's sharedList
    quizSet.sharedList = [...quizSet.sharedList, recipientId];
    await this.quizSetRepository.save(quizSet);

    // Update recipient's sharedList
    await this.usersService.addSharedQuizSet(recipientId, quizSetId);

    return quizSet;
  }

  async deleteQuizSet(setId: string, userId: string): Promise<void> {
    const quizSet = await this.quizSetRepository.findOne({ where: { setID: setId } });
    
    if (!quizSet) {
      throw new NotFoundException('Quiz set not found');
    }

    if (quizSet.creator !== userId) {
      throw new ForbiddenException('Only the creator can delete this quiz set');
    }

    // Delete associated short answer quizzes if applicable
    if (quizSet.quizType === 'short_answers') {
      await this.shortAnswerQuizRepository.delete({ quizSetID: setId });
    }

    // Remove setId from creator's createdList
    await this.usersService.removeCreatedQuizSet(userId, setId);

    // Remove setId from sharedList of all users who have this quiz set shared
    for (const sharedUserId of quizSet.sharedList) {
      await this.usersService.removeSharedQuizSet(sharedUserId, setId);
    }

    // Delete the quiz set
    await this.quizSetRepository.remove(quizSet);
  }

  async incrementQuizSetCount(setId: string, userId: string): Promise<QuizSet> {
    const quizSet = await this.quizSetRepository.findOne({ where: { setID: setId } });

    if (!quizSet) {
        throw new NotFoundException(`Quiz set with ID ${setId} not found`);
    }

    if (!quizSet.public) {
        if (quizSet.creator !== userId && !quizSet.sharedList.includes(userId)) {
            throw new ForbiddenException('You do not have permission to access this quiz set');
        }
    }

    quizSet.cnt += 1;
    return this.quizSetRepository.save(quizSet);
}
}