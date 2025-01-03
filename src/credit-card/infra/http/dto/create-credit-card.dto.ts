import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateCreditCardDto {
  @IsString()
  cardName: string

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  limit: number

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  closingDay: number

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  dueDay: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  lastDigits: number
}
