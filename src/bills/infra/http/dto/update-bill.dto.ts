import { Transform } from 'class-transformer'
import { IsBoolean, IsDate, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export class UpdateBillDto {
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
  amount?: number

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate?: Date

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean

  @IsOptional()
  @IsNumber()
  @Min(1)
  recurrenceDay?: number
}
