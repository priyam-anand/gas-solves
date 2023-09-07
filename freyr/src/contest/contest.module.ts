import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { RepoModule } from 'src/repo/repo.module';
import { JwtModule } from '@nestjs/jwt';
import { UserAddressMiddleware } from 'src/common/middlewares/user-address.middleware';
import { PagerMiddleware } from 'src/common/middlewares/pager.middleware';

@Module({
  providers: [ContestService],
  controllers: [ContestController],
  imports: [JwtModule.register({}), RepoModule],
})
export class ContestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAddressMiddleware).forRoutes(ContestController);
    consumer
      .apply(PagerMiddleware)
      .forRoutes({ path: '/contest', method: RequestMethod.GET });
  }
}
