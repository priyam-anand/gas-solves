import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateContestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDefined()
  @Type(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @IsDefined()
  @Type(() => Date)
  endTime: Date;

  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  problemStatement: string;

  @IsNumber()
  @IsNotEmpty()
  points: number;
}
