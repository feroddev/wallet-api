import { ApiProperty } from '@nestjs/swagger'
import { PaymentMethod } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class PayInvoiceDto {
  @ApiProperty({
    description: 'Método de pagamento da fatura',
    enum: PaymentMethod,
    example: 'PIX'
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  @IsOptional()
  paymentMethod?: PaymentMethod
}
