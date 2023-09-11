import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Get(':id')
  async getSubmission(@Param('id', ParseIntPipe) id: number) {
    return this.submissionService.getSubmission(id);
  }
}
