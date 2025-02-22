import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class UpdateCreditCardDto {
  @IsString()
  @IsOptional()
  cardName?: string

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  closingDay?: number

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  dueDay?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  lastDigits?: number
}
