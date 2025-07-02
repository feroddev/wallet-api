import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min
} from 'class-validator'

export class UpdateRecurringBillDto {
  @ApiProperty({ description: 'Nome da conta recorrente', required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: 'Descrição da conta recorrente',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: 'Valor da conta recorrente', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number

  @ApiProperty({
    description: 'Dia de recorrência mensal',
    minimum: 1,
    maximum: 31,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  recurrenceDay?: number
}
