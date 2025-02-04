import { Transform } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'
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

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date
}
