import { Module } from '@nestjs/common';
import { RepoModule } from 'src/repo/repo.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StorageFileModule } from 'src/storageFile/storageFile.module';

@Module({
  imports: [RepoModule, StorageFileModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
