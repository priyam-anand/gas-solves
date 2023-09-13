import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  name: string;
}
