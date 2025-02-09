import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { PaymentStatus } from './enum'

export class CreditCardExpenseDto {
  @IsDateString()
  dueDate: string

  @IsNumber()
  amount: number

  @IsNumber()
  installmentNumber: number

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @IsNumber()
  totalInstallments: number

  @IsString()
  creditCardId: string

  @IsString()
  categoryId: string

  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string
}
