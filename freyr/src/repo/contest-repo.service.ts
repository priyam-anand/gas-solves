import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Contest } from './entities/contest.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateContestDto } from 'src/contest/dto/CreateContest.dto';
import { DbException } from 'src/db/errors/db.error';
import { Question } from './entities/question.entity';

@Injectable()
export class ContestRepoService {
  private contestRepo: Repository<Contest>;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectEntityManager() private entitymanager: EntityManager,
  ) {
    this.contestRepo = entitymanager.getRepository(Contest);
  }

  async createContest(contestData: CreateContestDto) {
    return new Promise(async (resolve, reject) => {
      try {
        var createdContestId = -1;
        this.logger.info(`Saving contest data to record`);

        await this.entitymanager.transaction(async (manager: EntityManager) => {
          const newContest = new Contest();

          newContest.name = contestData.name;
          newContest.startTime = contestData.startTime;
          newContest.endTime = contestData.endTime;
          newContest.questions = [];

          for (const question of contestData.questions) {
            const newQuestion = new Question();
            (newQuestion.name = question.name),
              (newQuestion.problem_statement = question.problemStatement);
            newQuestion.pointes = question.points;
            newQuestion.submissions = [];

            const createdQuestion = await manager
              .getRepository(Question)
              .save(newQuestion);

            newContest.questions.push(createdQuestion);
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
          `Error in creating contest record : [contest data : ${JSON.stringify(
            contestData,
          )}] : ${error.stack}`,
        );
        reject(
          new DbException(
            'Could not save record to DB ',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }
}
