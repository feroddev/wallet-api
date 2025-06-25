import { PaymentMethod } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf
} from 'class-validator'
import { TransactionType } from './enum'

export class CreateTransactionDto {
  @ApiProperty({ description: 'ID da categoria da transação' })
  @IsNotEmpty()
  @IsString()
  categoryId: string

  @ApiProperty({ description: 'Nome da transação' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: 'Descrição da transação', required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: 'PIX'
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'Indica se a transação é recorrente',
    default: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean

  @ApiProperty({
    description: 'Indica se a transação já foi paga',
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean

  @ApiProperty({
    description:
      'ID do cartão de crédito (obrigatório se paymentMethod for CREDIT_CARD)',
    required: false
  })
  @ValidateIf((dto) => dto.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  @IsNotEmpty()
  creditCardId?: string

  @ApiProperty({
    description: 'ID da fatura (opcional)',
    required: false
  })
  @IsOptional()
  @IsString()
  invoiceId?: string

  @ApiProperty({
    description:
      'Número total de parcelas (obrigatório se paymentMethod for CREDIT_CARD)',
    required: false,
    minimum: 1
  })
  @ValidateIf((dto) => dto.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsNumber()
  @Min(1)
  totalInstallments?: number

  @ApiProperty({
    description: 'ID da compra para agrupar parcelas',
    required: false
  })
  @IsOptional()
  @IsString()
  purchaseId?: string

  @ApiProperty({
    description: 'Número da parcela atual',
    required: false,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  installmentNumber?: number

  @ApiProperty({
    description: 'Data da transação',
    example: '2025-06-01'
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: string

  @ApiProperty({
    description: 'Valor total da transação',
    example: 4500.0
  })
  @IsNumber()
  totalAmount: number

  @ApiProperty({
    description: 'Tipo da transação',
    enum: TransactionType,
    example: 'INCOME'
  })
  @IsEnum(TransactionType)
  type: TransactionType

  @ApiProperty({
    description: 'ID da conta recorrente (opcional)',
    required: false
  })
  @IsOptional()
  @IsString()
  recurringBillId?: string
}
