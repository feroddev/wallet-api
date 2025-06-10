import { PaymentMethod } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf
} from 'class-validator'
import { TransactionType } from './enum'

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean

  @IsOptional()
  @ValidateIf((dto) => dto.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  creditCardId?: string

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date?: string

  @IsOptional()
  @IsNumber()
  totalAmount?: number

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType
}
