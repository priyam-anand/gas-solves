import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/CreateContest.dto';
import { UserAddress } from 'src/common/decorators/user-address.decorator';
import { UpdateContestDto } from './dto/UpdateContest.dto';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  // admin only api, add auth guard with admin's api key
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createContest(@Body() contestData: CreateContestDto) {
    return await this.contestService.createContest(contestData);
  }

  @Patch('update')
  async updateContest(@Body() contestData: UpdateContestDto) {
    return await this.contestService.updateContest(contestData);
  }

  @Get()
  async getContests(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return await this.contestService.getContests(limit, offset);
  }

  @Get(':contestId')
  async getContest(
    @Param('contestId', ParseIntPipe) contestId: number,
    @UserAddress() address: string,
  ) {
    return await this.contestService.getContest(contestId, address);
  }

  // TODO : GET leaderboard
}
