import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GenericError } from 'src/common/errors/generic.error';

@Injectable()
export class SubmissionRepoService {
  private submissionRepo: Repository<Submission>;

  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.submissionRepo = this.entityManager.getRepository(Submission);
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
