import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBConfig } from './db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class DBModule {
  public static getConnectionOptions(
    dbConfig: DBConfig,
    configService: ConfigService,
  ): TypeOrmModuleOptions {
    let connectionOptions: TypeOrmModuleOptions =
      DBModule.getConnectionOptionsPostgres(configService);

    connectionOptions = {
      ...connectionOptions,
      synchronize: false,
      entities: dbConfig.entities,
    };
    return connectionOptions;
  }

  private static getConnectionOptionsPostgres(
    configService: ConfigService,
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: configService.get('POSTGRES_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
    };
  }

  public static forRoot(dbConfig: DBConfig): DynamicModule {
    return {
      module: DBModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (ConfigService) =>
            DBModule.getConnectionOptions(dbConfig, ConfigService),
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
