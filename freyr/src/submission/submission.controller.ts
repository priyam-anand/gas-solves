import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MakeSubmissionDto } from './dto/makeSubmission.dto';
import { UserAddress } from 'src/common/decorators/user-address.decorator';

@Controller('submission')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Get(':id')
  async getSubmission(@Param('id', ParseIntPipe) id: number) {
    return this.submissionService.getSubmission(id);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async makeSubmission(
    @Body() body: MakeSubmissionDto,
    @UploadedFile() file: Express.Multer.File,
    @UserAddress() address: string,
  ) {
    return this.submissionService.makeSubmission(
      body.questionId,
      file?.buffer,
      address,
    );
  }
}
