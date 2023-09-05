import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { DBModule } from './db/db.module';
import { RepoModule } from './repo/repo.module';
import { StorageFileModule } from './storageFile/storageFile.module';

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
      entities: [__dirname + '/repo/entities/*.entity.{.ts,.js}'],
    }),
    RepoModule,
    StorageFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
