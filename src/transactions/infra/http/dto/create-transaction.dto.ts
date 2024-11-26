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
  dueDate?: Date

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
  recurrenceInterval?: RecurrenceInterval

  @IsDate()
  @IsOptional()
  recurrenceStart?: Date

  @IsDate()
  @IsOptional()
  recurrenceEnd?: Date

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod
}
