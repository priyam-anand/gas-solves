import { Module } from '@nestjs/common';
import { StorageFileSerivce } from './storageFile.service';
import { RepoModule } from 'src/repo/repo.module';

@Module({
  providers: [StorageFileSerivce],
  imports: [RepoModule],
  exports: [StorageFileSerivce],
})
export class StorageFileModule {}
