import { Transform } from 'class-transformer'
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min
} from 'class-validator'

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  targetValue?: number

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  deadline?: Date
}
