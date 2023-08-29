import { Module } from '@nestjs/common';
import { HealthCheckContoller } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckContoller],
  providers: [],
})
export class HealthCheckModule {}
