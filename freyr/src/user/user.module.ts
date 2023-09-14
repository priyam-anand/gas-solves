import { Module } from '@nestjs/common';
import { RepoModule } from 'src/repo/repo.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StorageFileModule } from 'src/storageFile/storageFile.module';
import { AccessJwtAuthGuard } from 'src/common/guards/access-jwt-auth.guard';
import { AccessJwtStrategy } from 'src/common/guards/access-jwt-auth.strategy';

@Module({
  imports: [RepoModule, StorageFileModule],
  controllers: [UserController],
  providers: [UserService, AccessJwtAuthGuard, AccessJwtStrategy],
})
export class UserModule {}
