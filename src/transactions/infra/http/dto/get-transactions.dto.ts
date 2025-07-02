import { Transform } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PaymentMethod, TransactionType } from './enum'

export class GetTransactionsDto {
  @ApiProperty({ description: 'ID da categoria', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string

  @ApiProperty({ description: 'ID do cartão de crédito', required: false })
  @IsOptional()
  @IsString()
  creditCardId?: string

  @ApiProperty({
    description: 'Método de pagamento',
    required: false,
    enum: PaymentMethod
  })
  @IsOptional()
  @IsString()
  paymentMethod?: PaymentMethod

  @ApiProperty({
    description: 'Tipo de transação',
    required: false,
    enum: TransactionType
  })
  @IsOptional()
  @IsString()
  type?: TransactionType

  @ApiProperty({ description: 'Data inicial para filtro', required: false })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  startDate?: Date

  @ApiProperty({ description: 'Data final para filtro', required: false })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  endDate?: Date
}
