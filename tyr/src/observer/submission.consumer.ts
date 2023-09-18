import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PROCESS_PENDING, SUBMISSION_QUEUE } from 'src/common/utils/constants';
import { Logger } from 'winston';
import { SubmissionObserverService } from './submissionObserver.service';

@Processor(SUBMISSION_QUEUE)
export class SubmissionConsumer {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private submissionObserverService: SubmissionObserverService,
  ) {}

  @Process(PROCESS_PENDING)
  async handleSubmission(job: Job) {
    this.logger.info(`Processing submission job [jobId : ${job.id}]`);

    await this.submissionObserverService.handleSubmission(
      job.data.questionId,
      job.data.submissionId,
    );
  }
}
