import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/CreateContest.dto';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  // admin only api, add auth guard with admin's api key
  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createContest(@Body() contestData: CreateContestDto) {
    return await this.contestService.createContest(contestData);
  }
}
