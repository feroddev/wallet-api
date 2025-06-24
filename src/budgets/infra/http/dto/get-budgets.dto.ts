import { Transform } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class GetBudgetsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  month?: number

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  year?: number

  @IsOptional()
  @IsString()
  categoryId?: string
}
