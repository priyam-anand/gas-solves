import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SUBMISSION_QUEUE } from 'src/common/utils/constants';
import { SubmissionConsumer } from './submission.consumer';
import { SubmissionObserverService } from './submissionObserver.service';

@Module({
  imports: [BullModule.registerQueue({ name: SUBMISSION_QUEUE })],
  providers: [SubmissionConsumer, SubmissionObserverService],
  controllers: [],
})
export class ObserverModule {}
