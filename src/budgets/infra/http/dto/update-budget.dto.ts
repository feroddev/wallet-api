import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator'

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  limit?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number

  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number
}
