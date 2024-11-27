import { PaymentStatus } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'

export class GetInstallmentsDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  fromDueDate?: Date

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  toDueDate?: Date

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @IsOptional()
  @IsString()
  creditCardId?: string
}
