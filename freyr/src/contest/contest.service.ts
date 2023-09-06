import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateContestDto } from './dto/CreateContest.dto';
import { ContestApiException } from './errors/contest.error';
import { ContestRepoService } from 'src/repo/contest-repo.service';

@Injectable()
export class ContestService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private contestRepoService: ContestRepoService,
  ) {}

  async createContest(contestData: CreateContestDto) {
    try {
      this.logger.info(
        `Creating new contest with contest [contest data : ${JSON.stringify(
          contestData,
        )}]`,
      );

      ///////////////////// valiation /////////////////////
      // check length of questions is more than 0
      if (contestData.questions.length == 0) {
        throw new ContestApiException(
          'No questions provided for creating contest',
          HttpStatus.BAD_REQUEST,
        );
      }

      // check if start time is more than now, end time is more than now and start time, start time - endtime >= 3 hrs
      if (contestData.startTime.getTime() <= Date.now()) {
        throw new ContestApiException(
          'Start time cannot be less than current time',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (contestData.endTime.getTime() <= contestData.startTime.getTime()) {
        throw new ContestApiException(
          'End time cannot be less than start time',
          HttpStatus.BAD_REQUEST,
        );
      }

      ///////////////////// save to repo /////////////////////
      const createdContest = <number>(
        await this.contestRepoService.createContest(contestData)
      );

      // return id of contest
      return { contest_id: createdContest };
    } catch (error) {
      this.logger.error(
        `Error in creating new contest [contest data : ${JSON.stringify(
          contestData,
        )}]`,
      );
      throw new HttpException(
        {
          error: 'Error in creating new contest',
          reason: error.message,
        },
        error.status,
      );
    }
  }
}
