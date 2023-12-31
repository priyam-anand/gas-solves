import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { RepoModule } from 'src/repo/repo.module';
import { BullModule } from '@nestjs/bull';
import { SUBMISSION_QUEUE } from 'src/common/utils/constants';
import { StorageFileModule } from 'src/storageFile/storageFile.module';
import { AccessJwtAuthGuard } from 'src/common/guards/access-jwt-auth.guard';
import { AccessJwtStrategy } from 'src/common/guards/access-jwt-auth.strategy';

@Module({
  imports: [
    RepoModule,
    BullModule.registerQueue({ name: SUBMISSION_QUEUE }),
    StorageFileModule,
  ],
  providers: [SubmissionService, AccessJwtAuthGuard, AccessJwtStrategy],
  controllers: [SubmissionController],
})
export class SubmissionModule {}
