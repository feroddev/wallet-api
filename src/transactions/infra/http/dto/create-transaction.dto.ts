import { PaymentMethod, RecurrenceInterval } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateTransactionDto {
  @IsString()
  categoryId: string

  @IsString()
  @IsOptional()
  creditCardId?: string

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dueDate?: Date

  @IsDate()
  @Transform(({ value }) => new Date(value))
  transactionDate: Date

  @IsString()
  description: string

  @IsNumber()
  @Transform(({ value }) => Number(value))
  totalAmount: number

  @IsBoolean()
  @IsOptional()
  isInstallment?: boolean

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  totalInstallments?: number

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean

  @IsEnum(RecurrenceInterval)
  @IsOptional()
  recurrenceInterval?: RecurrenceInterval

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  recurrenceStart?: Date

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  recurrenceEnd?: Date

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod
}
