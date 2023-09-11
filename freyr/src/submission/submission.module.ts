import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { RepoModule } from 'src/repo/repo.module';
import { BullModule } from '@nestjs/bull';
import { SUBMISSION_QUEUE } from 'src/common/utils/constants';

@Module({
  imports: [RepoModule, BullModule.registerQueue({ name: SUBMISSION_QUEUE })],
  providers: [SubmissionService],
  controllers: [SubmissionController],
})
export class SubmissionModule {}
