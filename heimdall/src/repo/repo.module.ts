import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepoService } from './user-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepoService],
  controllers: [],
  exports: [UserRepoService],
})
export class RepoModule {}
