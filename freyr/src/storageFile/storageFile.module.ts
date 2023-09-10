import { Module, forwardRef } from '@nestjs/common';
import { StorageFileSerivce } from './storageFile.service';
import { RepoModule } from 'src/repo/repo.module';

@Module({
  providers: [StorageFileSerivce],
  imports: [forwardRef(() => RepoModule)],
  exports: [StorageFileSerivce],
  controllers: [],
})
export class StorageFileModule {}
