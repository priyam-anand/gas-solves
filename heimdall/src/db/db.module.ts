import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBConfig } from './db.config';

@Module({})
export class DBModule {
  public static getConnectionOptions(dbConfig: DBConfig): TypeOrmModuleOptions {
    var connectionOptions: TypeOrmModuleOptions =
      DBModule.getConnectionOptionsPostgres();

    connectionOptions = {
      ...connectionOptions,
      synchronize: true,
      entities: dbConfig.entities,
    };
    return connectionOptions;
  }

  private static getConnectionOptionsPostgres(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
    };
  }

  public static forRoot(dbConfig: DBConfig): DynamicModule {
    return {
      module: DBModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [],
          inject: [],
          useFactory: () => DBModule.getConnectionOptions(dbConfig),
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
