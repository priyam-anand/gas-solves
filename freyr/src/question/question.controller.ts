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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/createQuetsion.dto';
import { UserAddress } from 'src/common/decorators/user-address.decorator';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadQuestionBoilerplateDto } from './dto/uploadQuestionBoilerplate.dto';

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

  // admin only api
  @Post('upload')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('files'))
  async uploadQuestionBoilerplate(
    @Body() body: UploadQuestionBoilerplateDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.questionService.uploadBoilerplateCode(body.ids, files);
  }

  // admin only api
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createQuestion(@Body() questionData: CreateQuestionDto) {
    return this.questionService.createQuestion(questionData);
  }

  // admin only api
  @Patch('update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateQuestion(@Body() questionData: UpdateQuestionDto) {
    return this.questionService.updateQuestion(questionData);
  }

  // admin only api
  @Delete(':questionId')
  async deleteQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.questionService.deleteQuestion(questionId);
  }
}
