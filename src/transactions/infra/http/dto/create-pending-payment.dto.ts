import { PaymentStatus } from '@prisma/client'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreatePendingPaymentDto {
  @IsString()
  userId: string

  @IsString()
  description: string

  @IsDateString()
  dueDate: string

  @IsNumber()
  totalAmount: number

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus
}
