import { PaymentMethod, PaymentStatus } from '@prisma/client'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePendingPaymentDto {
  @ApiProperty({
    description: 'Nome do pagamento pendente',
    example: 'Conta de Luz',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: 'Descrição do pagamento pendente',
    example: 'Junho 2025',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Data de vencimento',
    example: '2025-06-15T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string

  @ApiProperty({
    description: 'Valor total',
    example: 230.90,
    required: false
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number

  @ApiProperty({
    description: 'Status do pagamento',
    enum: PaymentStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: 'BANK_SLIP',
    required: false
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod

  @ApiProperty({
    description: 'ID da categoria',
    example: 'uuid-categoria',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId?: string
}
