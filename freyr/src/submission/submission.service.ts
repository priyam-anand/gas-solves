import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GenericError } from 'src/common/errors/generic.error';
import { SUBMISSION_QUEUE } from 'src/common/utils/constants';
import { createFileKey } from 'src/common/utils/keys';
import { Question } from 'src/repo/entities/question.entity';
import { StorageFile } from 'src/repo/entities/storageFile.entity';
import { QuestionRepoService } from 'src/repo/question-repo.service';
import { SubmissionRepoService } from 'src/repo/submission-repo.service';
import { StorageFileSerivce } from 'src/storageFile/storageFile.service';
import { Logger } from 'winston';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectQueue(SUBMISSION_QUEUE) private submissionQueue: Queue,
    private submissionRepoService: SubmissionRepoService,
    private questionRepoService: QuestionRepoService,
    private storageFileService: StorageFileSerivce,
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
          reason: error.message,
        },
        error.status,
      );
    }
  }

  async makeSubmission(questionId: number, file: Buffer, address: string) {
    try {
      if (!address) {
        throw new GenericError(
          'User address not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!file) {
        throw new GenericError(
          'Submission file not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      const question = <Question>await this.questionRepoService.getQuestion({
        where: { id: questionId },
      });
      if (!question) {
        throw new GenericError(
          'Question with the given id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      if (!question.boilerplate_code) {
        throw new GenericError(
          'Question is not ready to take submissions',
          HttpStatus.BAD_REQUEST,
        );
      }

      const codeFile = <StorageFile>(
        await this.storageFileService.updload(
          createFileKey({ time: Date.now() }),
          file,
        )
      );

      const submissionId = await this.submissionRepoService.createSubmission(
        question.id,
        address,
        codeFile.public_url,
      );

      const job = await this.submissionQueue.add({
        questionId: question.id,
        submissionId: submissionId,
      });

      return { submissionId: submissionId, jobId: job.id };
    } catch (error) {
      this.logger.error(
        `Error in make submission [questionId : ${questionId}]`,
      );
      throw new HttpException(
        { error: 'Could not make submission', reason: error.message },
        error.status,
      );
    }
  }
}
