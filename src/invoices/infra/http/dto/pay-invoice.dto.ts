import { ApiProperty } from '@nestjs/swagger'
import { PaymentMethod } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty } from 'class-validator'

export class PayInvoiceDto {
  @ApiProperty({
    description: 'Método de pagamento da fatura',
    enum: PaymentMethod,
    example: 'PIX'
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'Data de pagamento da fatura',
    example: '2025-07-10'
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  paidAt: Date
}
