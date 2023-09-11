import { Module } from '@nestjs/common';
import { StorageFileRepoService } from './storage-file-repo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from './entities/storageFile.entity';
import { Contest } from './entities/contest.entity';
import { Question } from './entities/question.entity';
import { ContestRepoService } from './contest-repo.service';
import { QuestionRepoService } from './question-repo.service';
import { StorageFileModule } from 'src/storageFile/storageFile.module';
import { Submission } from './entities/submission.entity';
import { SubmissionRepoService } from './submission-repo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFile, Contest, Question, Submission]),
    StorageFileModule,
  ],
  providers: [
    StorageFileRepoService,
    ContestRepoService,
    QuestionRepoService,
    SubmissionRepoService,
  ],
  exports: [
    StorageFileRepoService,
    ContestRepoService,
    QuestionRepoService,
    SubmissionRepoService,
  ],
})
export class RepoModule {}
