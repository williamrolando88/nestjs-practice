import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset: number;
}
