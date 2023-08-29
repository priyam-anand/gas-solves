import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import { dotEnvOptions } from 'config/dotenv-options';

async function bootstrap() {
  dotenv.config(dotEnvOptions);

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  app.enableCors();
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.contentSecurityPolicy());

  await app.listen(PORT);
}
bootstrap();
