import { IsOptional, IsString } from 'class-validator'
import { PaymentMethod } from './enum'

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
}
