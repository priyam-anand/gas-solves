import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GenericError } from 'src/common/errors/generic.error';
import { SubmissionRepoService } from 'src/repo/submission-repo.service';
import { Logger } from 'winston';

@Injectable()
export class SubmissionObserverService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private submissionRepoService: SubmissionRepoService,
  ) {}

  async handleSubmission(questionId: number, submissionId: number) {
    try {
      this.logger.info(
        `evaluating submission [submissionId : ${submissionId}, questionId : ${questionId}]`,
      );
    } catch (error) {
      this.logger.error(
        `Error in evaluating the submission [submissionId : ${submissionId}, questionId : ${questionId}] : ${error.stack}`,
      );
      if (typeof error != typeof GenericError) {
      }
    }
  }
}
