import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from './entities/storageFile.entity';
import { Contest } from './entities/contest.entity';
import { Question } from './entities/question.entity';
import { QuestionRepoService } from './question-repo.service';
import { Submission } from './entities/submission.entity';
import { SubmissionRepoService } from './submission-repo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFile, Contest, Question, Submission]),
  ],
  providers: [QuestionRepoService, SubmissionRepoService],
  exports: [QuestionRepoService, SubmissionRepoService],
})
export class RepoModule {}
