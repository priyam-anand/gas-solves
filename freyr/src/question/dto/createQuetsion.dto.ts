import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { QuestionDto } from 'src/contest/dto/CreateContest.dto';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  contest_id: number;

  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
