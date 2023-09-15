import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateContestDto } from './dto/CreateContest.dto';
import { GenericError } from '../common/errors/generic.error';
import { ContestRepoService } from 'src/repo/contest-repo.service';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Contest } from 'src/repo/entities/contest.entity';
import { UpdateContestDto } from './dto/UpdateContest.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
        throw new GenericError(
          'No questions provided for creating contest',
          HttpStatus.BAD_REQUEST,
        );
      }

      // check if start time is more than now, end time is more than now and start time, start time - endtime >= 3 hrs
      if (contestData.startTime.getTime() <= Date.now()) {
        throw new GenericError(
          'Start time cannot be less than current time',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (contestData.endTime.getTime() <= contestData.startTime.getTime()) {
        throw new GenericError(
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
        )}] : ${error.stack}`,
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

  async updateContest(contestData: UpdateContestDto) {
    try {
      this.logger.info(
        `Updating contest [contestData : ${JSON.stringify(contestData)}]`,
      );

      const result = <Contest>await this.contestRepoService.getContest({
        where: { id: contestData.id },
      });

      if (!result) {
        throw new GenericError(
          `Contest with id ${contestData.id} does not exist`,
          HttpStatus.NOT_FOUND,
        );
      }

      const partialentity: QueryDeepPartialEntity<Contest> = {};

      partialentity.name = contestData.name ? contestData.name : result.name;
      partialentity.startTime = contestData.startTime
        ? contestData.startTime
        : result.startTime;
      partialentity.endTime = contestData.endTime
        ? contestData.endTime
        : result.endTime;

      const newResult = await this.contestRepoService.updateContest(
        contestData.id,
        partialentity,
        contestData.questions,
      );

      return newResult;
    } catch (error) {
      this.logger.error(
        `Error in updating contest [contestData : ${JSON.stringify(
          contestData,
        )}] : ${error.stack}`,
      );
      throw new HttpException(
        {
          error: 'Error in updating contest',
          reason: error.message,
        },
        error.status,
      );
    }
  }

  async getContest(contestId: number, address?: string) {
    try {
      this.logger.info(
        `Fetching contest [contestId : ${contestId}, addresss : ${address}]`,
      );

      const findContestOptions: FindOneOptions<Contest> = {
        relations: { questions: address ? { submissions: true } : true },
        where: {
          id: contestId,
        },
      };
      const result = <Contest>(
        await this.contestRepoService.getContest(findContestOptions)
      );
      if (!result) {
        throw new GenericError(
          'Contest with given id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (address) {
        result.questions.forEach((question) => {
          question.submissions = question.submissions?.filter((sub) => {
            if (sub.user?.address?.toLowerCase() === address) return sub;
          });
        });
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error in getting contest [contestId : ${contestId}] : ${error.stack}`,
      );
      throw new HttpException(
        {
          error: `Error in getting contest with id ${contestId}`,
          reason: error.message,
        },
        error.status,
      );
    }
  }

  async getContests(limit: number, offset: number) {
    try {
      this.logger.info(
        `Fetching contests [limit : ${limit}, offset : ${offset}]`,
      );

      limit = Math.min(limit, 50);
      const findOptions: FindManyOptions<Contest> = {
        take: limit,
        skip: offset,
      };
      const result = <[Contest[], number]>(
        await this.contestRepoService.getContests(findOptions)
      );

      return {
        data: result[0],
        total_count: result[1],
        continuation: Math.min(offset + result[0].length, result[1]),
      };
      // const result = await this.contestRepoService.getContests({});
    } catch (error) {
      this.logger.error(
        `Error in getting contests [limit : ${limit}, offset : ${offset}] : ${error.stack}`,
      );
      throw new HttpException(
        {
          error: 'Error in getting contests',
          reason: error.message,
        },
        error.status,
      );
    }
  }
}
