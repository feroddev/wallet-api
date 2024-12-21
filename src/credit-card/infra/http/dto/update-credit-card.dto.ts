import { Decimal } from '@prisma/client/runtime/library'
import { Transform } from 'class-transformer'
import {
  IsDecimal,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'

export class UpdateCreditCardDto {
  @IsString()
  @IsOptional()
  cardName?: string

  @IsDecimal()
  @IsOptional()
  @Transform(({ value }) => new Decimal(value))
  limit?: Decimal

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
