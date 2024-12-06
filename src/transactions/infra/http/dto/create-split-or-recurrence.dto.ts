import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf
} from 'class-validator'
import { PaymentStatus, SplitType } from './enum'

export class SplitOrRecurrenceDto {
  @IsEnum(SplitType)
  type: SplitType

  @IsDateString()
  dueDate: string

  @IsNumber()
  amount: number

  @IsOptional()
  @IsNumber()
  installmentNumber?: number

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @IsString()
  transactionId: string

  @IsOptional()
  @IsNumber()
  totalInstallments?: number

  @ValidateIf((dto) => dto.type === SplitType.INSTALLMENT)
  @IsOptional()
  @IsString()
  creditCardId?: string
}
