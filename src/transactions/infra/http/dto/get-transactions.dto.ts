import { IsOptional, IsString } from 'class-validator'
import { PaymentMethod, TransactionType } from './enum'

export class GetTransactionsDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  creditCardId?: string

  @IsOptional()
  @IsString()
  paymentMethod?: PaymentMethod

  @IsOptional()
  @IsString()
  type?: TransactionType
}
