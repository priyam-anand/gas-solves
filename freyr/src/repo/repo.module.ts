import { Module } from '@nestjs/common';
import { StorageFileRepoService } from './storage-file-repo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from './entities/storageFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StorageFile])],
  providers: [StorageFileRepoService],
  exports: [StorageFileRepoService],
})
export class RepoModule {}
