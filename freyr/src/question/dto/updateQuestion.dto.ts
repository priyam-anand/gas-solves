import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  problemStatement: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  points: number;
}
