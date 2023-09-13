import { IsNotEmpty, IsNumber } from 'class-validator';

export class MakeSubmissionDto {
  @IsNotEmpty()
  @IsNumber()
  questionId: number;
}
