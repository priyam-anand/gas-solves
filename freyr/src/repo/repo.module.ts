import { Module } from '@nestjs/common';
import { StorageFileRepoService } from './storage-file-repo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from './entities/storageFile.entity';
import { Contest } from './entities/contest.entity';
import { Question } from './entities/question.entity';
import { ContestRepoService } from './contest-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([StorageFile, Contest, Question])],
  providers: [StorageFileRepoService, ContestRepoService],
  exports: [StorageFileRepoService, ContestRepoService],
})
export class RepoModule {}
