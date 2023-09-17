import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/createQuetsion.dto';
import { UserAddress } from 'src/common/decorators/user-address.decorator';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminApiAuthGuard } from 'src/common/guards/admin-api-auth.guard';
import { UploadQuestionFilesDto } from './dto/uploadQuestionFilesDto.dto';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get(':questionId')
  async getQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @UserAddress() address: string,
  ) {
    return await this.questionService.getQuestion(questionId, address);
  }

  @UseGuards(AdminApiAuthGuard)
  @Post('upload-code')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('files'))
  async uploadQuestionBoilerplate(
    @Body() body: UploadQuestionFilesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.questionService.uploadBoilerplateCode(body.ids, files);
  }

  @UseGuards(AdminApiAuthGuard)
  @Post('upload-test')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('files'))
  async uploadTestFile(
    @Body() body: UploadQuestionFilesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.questionService.uploadTestFiles(body.ids, files);
  }

  @UseGuards(AdminApiAuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createQuestion(@Body() questionData: CreateQuestionDto) {
    return this.questionService.createQuestion(questionData);
  }

  @UseGuards(AdminApiAuthGuard)
  @Patch('update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateQuestion(@Body() questionData: UpdateQuestionDto) {
    return this.questionService.updateQuestion(questionData);
  }

  @UseGuards(AdminApiAuthGuard)
  @Delete(':questionId')
  async deleteQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.questionService.deleteQuestion(questionId);
  }
}
