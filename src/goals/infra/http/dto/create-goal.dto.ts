import { Transform } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  targetValue: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  savedValue?: number

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  deadline: Date
}
