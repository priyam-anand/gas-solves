import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class UploadQuestionFilesDto {
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ids: number[];
}
