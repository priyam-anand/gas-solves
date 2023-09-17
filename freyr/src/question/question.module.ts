import { Module } from '@nestjs/common';
import { RepoModule } from 'src/repo/repo.module';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { AdminApiAuthGuard } from 'src/common/guards/admin-api-auth.guard';
import { AdminApiAuthStrategy } from 'src/common/guards/admin-api-auth.strategy';

@Module({
  imports: [RepoModule],
  providers: [QuestionService, AdminApiAuthGuard, AdminApiAuthStrategy],
  controllers: [QuestionController],
})
export class QuestionModule {}
