import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class UploadQuestionBoilerplateDto {
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ids: number[];
}
