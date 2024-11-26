import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'

export class CreateInstallmentDto {
  @IsString()
  transactionId: string

  @IsDate()
  dueDate: Date

  @IsDate()
  @IsOptional()
  paidAt?: Date

  @IsNumber()
  @IsPositive()
  amount: number

  @IsNumber()
  @IsPositive()
  installmentNumber: number
}
