import { PaymentMethod } from '@prisma/client'
import {
  IsDateString,
  IsEnum,
  IsOptional
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PayPendingPaymentDto {
  @ApiProperty({
    description: 'Data de pagamento',
    example: '2025-06-15T00:00:00.000Z'
  })
  @IsDateString()
  paidAt: string

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: 'BANK_SLIP'
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod
}
