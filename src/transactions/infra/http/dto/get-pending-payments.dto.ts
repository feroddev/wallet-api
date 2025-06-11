import { PaymentStatus } from '@prisma/client'
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetPendingPaymentsDto {
  @ApiProperty({
    description: 'Status do pagamento',
    enum: PaymentStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus

  @ApiProperty({
    description: 'Data de início para filtro',
    example: '2025-06-01T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiProperty({
    description: 'Data de fim para filtro',
    example: '2025-06-30T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string

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
