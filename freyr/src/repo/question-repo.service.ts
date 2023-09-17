import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  EntityManager,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Question } from './entities/question.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectEntityManager } from '@nestjs/typeorm';
import { GenericError } from 'src/common/errors/generic.error';
import { QuestionDto } from 'src/contest/dto/CreateContest.dto';
import { ContestRepoService } from './contest-repo.service';
import { Contest } from './entities/contest.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { StorageFileRepoService } from './storage-file-repo.service';
import { StorageFile } from './entities/storageFile.entity';
import { StorageFileSerivce } from 'src/storageFile/storageFile.service';
import { createFileKey, createTestKey } from 'src/common/utils/keys';

@Injectable()
export class QuestionRepoService {
  private questionRepo: Repository<Question>;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectEntityManager() private entityManager: EntityManager,
    private storageFileService: StorageFileSerivce,
    @Inject(forwardRef(() => ContestRepoService))
    private contestRepoService: ContestRepoService,
    private storageFileRepoService: StorageFileRepoService,
  ) {
    this.questionRepo = entityManager.getRepository(Question);
  }

  async createQuestions(contestId: number, questions: QuestionDto[]) {
    return new Promise(async (resolve, reject) => {
      try {
        let result: UpdateResult;
        await this.entityManager.transaction(async (manager) => {
          const contest = <Contest>await this.contestRepoService.getContest({
            where: { id: contestId },
          });

          for (const question of questions) {
            const newQuestion = <Question>(
              await this.createQuestion(question, manager)
            );
            contest.questions.push(newQuestion);
          }
          result = await manager
            .getRepository(Contest)
            .update({ id: contestId }, contest);
        });
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in creating new questions : [contestId : ${contestId}, question data : ${JSON.stringify(
            questions,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not create new questions',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async updateQuestion(
    questionId: number,
    partialEntity: QueryDeepPartialEntity<Question>,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Updating question : [questionId : ${questionId}, question data : ${JSON.stringify(
            partialEntity,
          )}]`,
        );
        const result = await this.questionRepo.update(
          { id: questionId },
          partialEntity,
        );
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in updating question : [questionId : ${questionId}, question data : ${JSON.stringify(
            partialEntity,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not update question',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async createQuestion(
    question: QuestionDto,
    manager: EntityManager = this.entityManager,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const newQuestion = new Question();
        newQuestion.name = question.name;
        newQuestion.problem_statement = question.problemStatement;
        newQuestion.pointes = question.points;
        newQuestion.abi = question.abi;
        newQuestion.submissions = [];

        const createdQuestion = await manager
          .getRepository(Question)
          .save(newQuestion);

        resolve(createdQuestion);
      } catch (error) {
        this.logger.error(
          `Error in create new question : [question data : ${JSON.stringify(
            question,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not create new question',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async getQuestion(options: FindOneOptions<Question>) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Finding question record [condition : ${JSON.stringify(options)}]`,
        );
        const result = await this.questionRepo.findOne(options);
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in finding question record [condition : ${JSON.stringify(
            options,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not fetch record from DB',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async deleteQuestion(questionId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const question = <Question>(
          await this.getQuestion({ where: { id: questionId } })
        );

        if (question.boilerplate_code) {
          // delete storage file record
          const storageFile = <StorageFile>(
            await this.storageFileRepoService.getStorageFile({
              where: { public_url: question.boilerplate_code },
            })
          );
          await this.storageFileRepoService.deleteStorageFile(storageFile.key);

          // delete from s3
          await this.storageFileService.delete(storageFile.key);
        }

        // delete question
        const result = await this.questionRepo.delete(questionId);
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in deleting question [questionId : ${questionId}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not delete question from record',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async uploadBoilerplates(questionId: number, file: Express.Multer.File) {
    return new Promise(async (resolve, reject) => {
      try {
        let result: Question;
        await this.entityManager.transaction(async (manager) => {
          const question = await manager
            .getRepository(Question)
            .findOne({ where: { id: questionId } });

          if (question.boilerplate_code) {
            // delete storage file record
            const storageFile = <StorageFile>(
              await this.storageFileRepoService.getStorageFile({
                where: { public_url: question.boilerplate_code },
              })
            );
            await this.storageFileRepoService.deleteStorageFile(
              storageFile.key,
            );

            // delete from s3
            await this.storageFileService.delete(storageFile.key);
          }

          // upload
          const storageFile = <StorageFile>(
            await this.storageFileService.updload(
              createFileKey({ time: Date.now() }),
              file.buffer,
            )
          );
          // update
          question.boilerplate_code = storageFile.public_url;
          result = <Question>await this.updateQuestion(questionId, question);
        });
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in uploading boilerplate code [quetionId : ${questionId}] : ${error.stack}`,
        );
        reject(
          error.status
            ? error
            : new GenericError(
                'Error in uploading boilerplate code',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
        );
      }
    });
  }

  async uploadTestCase(questionId: number, file: Express.Multer.File) {
    return new Promise(async (resolve, reject) => {
      try {
        let result: Question;
        await this.entityManager.transaction(async (manager) => {
          const question = await manager
            .getRepository(Question)
            .findOne({ where: { id: questionId } });

          if (question.test_file) {
            // delete storage file record
            const storageFile = <StorageFile>(
              await this.storageFileRepoService.getStorageFile({
                where: { public_url: question.test_file },
              })
            );
            await this.storageFileRepoService.deleteStorageFile(
              storageFile.key,
            );

            // delete from s3
            await this.storageFileService.delete(storageFile.key);
          }

          // upload
          const storageFile = <StorageFile>(
            await this.storageFileService.updload(
              createTestKey({ time: Date.now() }),
              file.buffer,
            )
          );
          // update
          question.test_file = storageFile.public_url;
          result = <Question>await this.updateQuestion(questionId, question);
        });
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in uploading boilerplate code [quetionId : ${questionId}] : ${error.stack}`,
        );
        reject(
          error.status
            ? error
            : new GenericError(
                'Error in uploading boilerplate code',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
        );
      }
    });
  }
}
