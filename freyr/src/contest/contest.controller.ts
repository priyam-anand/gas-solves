import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/CreateContest.dto';
import { UserAddress } from 'src/common/decorators/user-address.decorator';
import { UpdateContestDto } from './dto/UpdateContest.dto';
import { AdminApiAuthGuard } from 'src/common/guards/admin-api-auth.guard';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  @UseGuards(AdminApiAuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createContest(@Body() contestData: CreateContestDto) {
    return await this.contestService.createContest(contestData);
  }

  @UseGuards(AdminApiAuthGuard)
  @Patch('update')
  @UsePipes(new ValidationPipe({ transform: true }))
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
