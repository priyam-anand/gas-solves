import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DBModule } from './db/db.module';
import { HealthCheckModule } from './health/health.module';
import { User } from './repo/entities/user.entity';
import { Submission } from './repo/entities/submission.entity';
import { Question } from './repo/entities/question.entity';
import { Contest } from './repo/entities/contest.entity';
import { StorageFile } from './repo/entities/storageFile.entity';

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
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/error/'),
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DBModule.forRoot({
      entities: [Contest, Question, Submission, User, StorageFile],
    }),
    AuthModule,
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
