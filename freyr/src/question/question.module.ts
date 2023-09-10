import { Module } from '@nestjs/common';
import { RepoModule } from 'src/repo/repo.module';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

@Module({
  imports: [RepoModule],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
