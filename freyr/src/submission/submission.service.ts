import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GenericError } from 'src/common/errors/generic.error';
import { SUBMISSION_QUEUE } from 'src/common/utils/constants';
import { SubmissionRepoService } from 'src/repo/submission-repo.service';
import { Logger } from 'winston';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectQueue(SUBMISSION_QUEUE) private submissionQueue: Queue,
    private submissionRepoService: SubmissionRepoService,
  ) {}

  async getSubmission(id: number) {
    try {
      this.logger.info(`Fetching submission [id : ${id}]`);

      const result = await this.submissionRepoService.getSubmission({
        where: { id: id },
      });

      if (!result) {
        throw new GenericError(
          'Submission with given id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Error in getting submission [id : ${id}]`);
      throw new HttpException(
        {
          error: 'Could not fetch submission',
          reason: error.reason,
        },
        error.status,
      );
    }
  }
}
