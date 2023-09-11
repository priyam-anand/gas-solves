import { BullModule, BullRootModuleOptions } from '@nestjs/bull';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class QueueModule {
  public static getConnection(configService: ConfigService) {
    let connectionOption: BullRootModuleOptions =
      QueueModule.getConnectionDetails(configService);

    // can add customimzation here
    connectionOption = { ...connectionOption };
    return connectionOption;
  }

  private static getConnectionDetails(
    configService: ConfigService,
  ): BullRootModuleOptions {
    return {
      redis: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
    };
  }

  public static forRoot(): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            QueueModule.getConnection(configService),
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
