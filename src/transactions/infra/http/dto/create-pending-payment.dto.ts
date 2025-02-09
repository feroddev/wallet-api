import { PaymentStatus } from '@prisma/client'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'

export class CreatePendingPaymentDto {
  @IsString()
  @IsUUID()
  userId: string

  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsDateString()
  dueDate: string

  @IsNumber()
  totalAmount: number

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @IsString()
  categoryId: string
}
