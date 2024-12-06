import { PaymentMethod, RecurrenceInterval } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf
} from 'class-validator'

export class CreateTransactionDto {
  @IsString()
  categoryId: string

  @IsString()
  @ValidateIf((o) => o.paymentMethod === 'CREDIT_CARD')
  creditCardId?: string

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dueDate?: Date

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date

  @IsString()
  description: string

  @IsNumber()
  @Transform(({ value }) => Number(value))
  totalAmount: number

  @IsBoolean()
  @IsOptional()
  isInstallment?: boolean

  @ValidateIf((o) => o.isInstallment === true)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  totalInstallments?: number

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean

  @ValidateIf((o) => o.isRecurring === true)
  @IsEnum(RecurrenceInterval)
  recurrenceInterval?: RecurrenceInterval

  @ValidateIf((o) => o.isRecurring === true)
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  recurrenceStart?: Date

  @ValidateIf((o) => o.isRecurring === true)
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  recurrenceEnd?: Date

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod
}
