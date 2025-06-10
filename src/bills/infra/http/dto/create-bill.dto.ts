import { Transform } from 'class-transformer'
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export class CreateBillDto {
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
  amount: number

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate: Date

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean

  @IsOptional()
  @IsNumber()
  @Min(1)
  recurrenceDay?: number
}
