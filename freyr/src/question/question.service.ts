import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateQuestionDto } from './dto/createQuetsion.dto';
import { ContestRepoService } from 'src/repo/contest-repo.service';
import { Contest } from 'src/repo/entities/contest.entity';
import { GenericError } from 'src/common/errors/generic.error';
import { QuestionRepoService } from 'src/repo/question-repo.service';
import { Question } from 'src/repo/entities/question.entity';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private contestRepoService: ContestRepoService,
    private questionRepoService: QuestionRepoService,
  ) {}

  async getQuestion(questionId: number, address?: string) {
    try {
      this.logger.info(
        `Fetching question [questionId : ${questionId}, address : ${address}]`,
      );

      const result = <Question>await this.questionRepoService.getQuestion({
        where: { id: questionId },
        relations: { contest: true, submissions: true },
      });

      if (!result) {
        throw new GenericError(
          'Question with given id not found',
          HttpStatus.NOT_FOUND,
        );
      }
      if (address) {
        result.submissions = result.submissions.filter((sub) => {
          if (sub.user.address?.toLowerCase() === address) return sub;
        });
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error in fetching question [questionId : ${questionId}, address : ${address}] : ${error.stack}`,
      );
      throw new HttpException(
        { error: 'Error in fetching question', reason: error.message },
        error.status,
      );
    }
  }

  async createQuestion(questionData: CreateQuestionDto) {
    try {
      this.logger.info(
        `Creating new questions [question data : ${JSON.stringify(
          questionData,
        )}]`,
      );
      // check if contest exist and has not ended
      const contest = <Contest>await this.contestRepoService.getContest({
        where: { id: questionData.contest_id },
      });

      if (!contest) {
        throw new GenericError('Contest does not exist', HttpStatus.NOT_FOUND);
      }

      if (contest.endTime.getTime() <= Date.now()) {
        throw new GenericError(
          'Contest has already ended',
          HttpStatus.BAD_REQUEST,
        );
      }

      // save each of the questions
      const result = await this.questionRepoService.createQuestions(
        questionData.contest_id,
        questionData.questions,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error in creating new question [questions data : ${JSON.stringify(
          questionData,
        )}] : ${error.stack}`,
      );
      throw new HttpException(
        {
          error: 'Error in creating new question',
          reason: error.message,
        },
        error.status,
      );
    }
  }

  async updateQuestion(questionData: UpdateQuestionDto) {
    try {
      this.logger.info(
        `Updating question [question data : ${JSON.stringify(questionData)}]`,
      );
      // check if question exists
      const question = <Question>await this.questionRepoService.getQuestion({
        where: { id: questionData.id },
      });
      if (!question) {
        throw new GenericError(
          'Question with given id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // update question
      const partialEntity: QueryDeepPartialEntity<Question> = {};
      partialEntity.name = questionData.name
        ? questionData.name
        : question.name;
      partialEntity.problem_statement = questionData.problemStatement
        ? questionData.problemStatement
        : question.problem_statement;
      partialEntity.pointes = questionData.points
        ? questionData.points
        : question.pointes;
      partialEntity.abi = questionData.abi ? questionData.abi : question.abi;

      const newResult = await this.questionRepoService.updateQuestion(
        questionData.id,
        partialEntity,
      );
      return newResult;
    } catch (error) {
      this.logger.error(
        `Error in updating question [question data : ${JSON.stringify(
          questionData,
        )}] : ${error.stack}`,
      );
      throw new HttpException(
        { error: 'Error in updating question', reason: error.message },
        error.status,
      );
    }
  }

  async deleteQuestion(questionId: number) {
    try {
      this.logger.info(`Deleting question [questionId : ${questionId}]`);

      const question = <Question>await this.questionRepoService.getQuestion({
        where: { id: questionId },
      });

      if (!question) {
        throw new GenericError(
          'Question with given id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await this.questionRepoService.deleteQuestion(questionId);
      return result;
    } catch (error) {
      this.logger.error(
        `Error in deleting question [questionId : ${questionId}] : ${error.stack}`,
      );
      throw new HttpException(
        { error: 'Error in deleting question', reason: error.message },
        error.status,
      );
    }
  }

  async uploadTestFiles(questionIds: number[], files: Express.Multer.File[]) {
    try {
      this.logger.info(
        `Uploading test cases for questions [questionIds : ${JSON.stringify(
          questionIds,
        )}]`,
      );

      if (questionIds.length !== files.length) {
        throw new GenericError(
          'Number of questions and files uploaded do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      for (let i = 0; i < questionIds.length; i++) {
        const question = await this.questionRepoService.getQuestion({
          where: { id: questionIds[i] },
        });
        if (!question) {
          throw new GenericError(
            `Question with given id - ${questionIds[i]} not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        await this.questionRepoService.uploadTestCase(questionIds[i], files[i]);
      }

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error in uploading test cases for questions [questionIds : ${JSON.stringify(
          questionIds,
        )}] : ${error.stack}`,
      );
      throw new HttpException(
        {
          error: 'Error in uploading test cases files',
          reason: error.message,
        },
        error.status,
      );
    }
  }

  async uploadBoilerplateCode(
    questionIds: number[],
    files: Express.Multer.File[],
  ) {
    try {
      this.logger.info(
        `Uploading boilerplate code for questions [questionIds : ${JSON.stringify(
          questionIds,
        )}]`,
      );

      if (questionIds.length !== files.length) {
        throw new GenericError(
          'Number of questions and files uploaded do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      for (let i = 0; i < questionIds.length; i++) {
        const question = await this.questionRepoService.getQuestion({
          where: { id: questionIds[i] },
        });
        if (!question) {
          throw new GenericError(
            `Question with given id - ${questionIds[i]} not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        await this.questionRepoService.uploadBoilerplates(
          questionIds[i],
          files[i],
        );
      }

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error in uploading boilerplate code for questions [questionIds : ${JSON.stringify(
          questionIds,
        )}] : ${error.stack}`,
      );
      throw new HttpException(
        {
          error: 'Error in uploading boilerplate code files',
          reason: error.message,
        },
        error.status,
      );
    }
  }
}
