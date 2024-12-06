import { PaymentMethod } from '@prisma/client'
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

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @ValidateIf((dto) => dto.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  @IsNotEmpty()
  creditCardId?: string

  @ValidateIf((dto) => dto.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsNumber()
  @Min(1)
  totalInstallments?: number

  @ValidateIf((dto) => dto.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsOptional()
  @IsBoolean()
  isSplitOrRecurring?: boolean

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: string

  @IsNumber()
  totalAmount: number
}
