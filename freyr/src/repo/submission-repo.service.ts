import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Submission, Verdict } from './entities/submission.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GenericError } from 'src/common/errors/generic.error';
import { QuestionRepoService } from './question-repo.service';
import { Question } from './entities/question.entity';
import { User } from './entities/user.entity';
import { UserRepoService } from './user-repo.service';

@Injectable()
export class SubmissionRepoService {
  private submissionRepo: Repository<Submission>;

  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private questionRepoService: QuestionRepoService,
    private userRepoService: UserRepoService,
  ) {
    this.submissionRepo = this.entityManager.getRepository(Submission);
  }

  async createSubmission(
    questionId: number,
    address: string,
    submissionFile: string,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Creating submission record [questionId : ${questionId}, address : ${address}, submissionFile : ${submissionFile}]`,
        );
        let submissionId: number;
        await this.entityManager.transaction(async (manager) => {
          const newSubmission = new Submission();
          newSubmission.code_file = submissionFile;
          newSubmission.verdict = Verdict.PROCESSING;
          const question = <Question>await this.questionRepoService.getQuestion(
            {
              where: { id: questionId },
              relations: { submissions: true },
            },
          );
          newSubmission.question = question;
          const user = <User>(
            await this.userRepoService.getUser({ where: { address: address } })
          );
          newSubmission.user = user;
          const createdSubmission = await manager
            .getRepository(Submission)
            .save(newSubmission);
          submissionId = createdSubmission.id;
        });

        resolve(submissionId);
      } catch (error) {
        this.logger.error(
          `Error in create submission record [questionId : ${questionId}, address : ${address}, submissionFile : ${submissionFile}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not create submission record',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async getSubmission(options: FindOneOptions<Submission>) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Fetching submission record [options : ${JSON.stringify(options)}]`,
        );
        const result = await this.submissionRepo.findOne(options);
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in fetching submission record [options : ${JSON.stringify(
            options,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not fetch submission record',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }
}
