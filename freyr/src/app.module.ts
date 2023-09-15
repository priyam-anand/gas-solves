import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { DBModule } from './db/db.module';
import { RepoModule } from './repo/repo.module';
import { Contest } from './repo/entities/contest.entity';
import { Question } from './repo/entities/question.entity';
import { StorageFile } from './repo/entities/storageFile.entity';
import { Submission } from './repo/entities/submission.entity';
import { User } from './repo/entities/user.entity';
import { ContestModule } from './contest/contest.module';
import { QuestionModule } from './question/question.module';
import { SubmissionModule } from './submission/submission.module';
import { QueueModule } from './queue/queue.module';
import { UserModule } from './user/user.module';
import { LogsMiddleware } from './common/middlewares/logs.middleware';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.colorize({ all: true }),
        }),
        new winston.transports.File({
          dirname: path.join('logs/'),
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          dirname: path.join('logs/'),
          filename: 'combined.log',
        }),
      ],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DBModule.forRoot({
      entities: [Contest, Question, StorageFile, Submission, User],
    }),
    QueueModule.forRoot(),
    RepoModule,
    ContestModule,
    QuestionModule,
    SubmissionModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
