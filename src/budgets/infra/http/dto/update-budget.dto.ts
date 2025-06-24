import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min
} from 'class-validator'

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  limit?: number
}
