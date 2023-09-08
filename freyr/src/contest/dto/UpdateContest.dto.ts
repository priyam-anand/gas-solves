import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionDto } from './CreateContest.dto';

export class UpdateContestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => Date)
  startTime: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => Date)
  endTime: Date;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
