import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Contest } from './entities/contest.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  CreateContestDto,
  QuestionDto,
} from 'src/contest/dto/CreateContest.dto';
import { GenericError } from '../common/errors/generic.error';
import { Question } from './entities/question.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { QuestionRepoService } from './question-repo.service';

@Injectable()
export class ContestRepoService {
  private contestRepo: Repository<Contest>;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectEntityManager() private entitymanager: EntityManager,
    @Inject(forwardRef(() => QuestionRepoService))
    private questionRepoService: QuestionRepoService,
  ) {
    this.contestRepo = entitymanager.getRepository(Contest);
  }

  async createContest(contestData: CreateContestDto) {
    return new Promise(async (resolve, reject) => {
      try {
        let createdContestId = -1;
        this.logger.info(`Saving contest data to record`);

        await this.entitymanager.transaction(async (manager: EntityManager) => {
          const newContest = new Contest();

          newContest.name = contestData.name;
          newContest.startTime = contestData.startTime;
          newContest.endTime = contestData.endTime;
          newContest.questions = [];

          for (const question of contestData.questions) {
            const newQuestion = <Question>(
              await this.questionRepoService.createQuestion(question)
            );
            newContest.questions.push(newQuestion);
          }

          const createdContest = await manager
            .getRepository(Contest)
            .save(newContest);
          createdContestId = createdContest.id;
        });

        this.logger.info(`Created contest [contest id : ${createdContestId}]`);

        resolve(createdContestId);
      } catch (error) {
        this.logger.error(
          `Error in creating contest record [contest data : ${JSON.stringify(
            contestData,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not save record to DB ',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async updateContest(
    id: number,
    partialQuery: QueryDeepPartialEntity<Contest>,
    questions: QuestionDto[],
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.entitymanager.transaction(async (manager: EntityManager) => {
          if (questions) {
            this.logger.info(
              `Updating questions in the contest [contestId : ${id}, question : ${JSON.stringify(
                questions,
              )}]`,
            );
            partialQuery.questions = [];
            for (const question of questions) {
              const newQuestion = <Question>(
                await this.questionRepoService.createQuestion(question)
              );
              partialQuery.questions.push(newQuestion);
            }
          }

          const result: UpdateResult = await manager
            .getRepository(Contest)
            .update({ id: id }, partialQuery);

          resolve(result);
        });
      } catch (error) {
        this.logger.error(
          `Error in updating contest record [contestId : ${id}, contest data : ${JSON.stringify(
            partialQuery,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not update record to DB',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async getContest(options: FindOneOptions<Contest>) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Finding contest record [condition : ${JSON.stringify(options)}]`,
        );
        const result = await this.contestRepo.findOne(options);
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in finding contest record [condition : ${JSON.stringify(
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

  async getContests(options: FindManyOptions<Contest>) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Finding contests records [condition : ${JSON.stringify(options)}]`,
        );
        const result = await this.contestRepo.findAndCount(options);
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in finding contest records [condition : ${JSON.stringify(
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
}
