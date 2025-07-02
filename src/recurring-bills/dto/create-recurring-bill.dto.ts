import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min
} from 'class-validator'

export class CreateRecurringBillDto {
  @ApiProperty({ description: 'Nome da conta recorrente' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descrição da conta recorrente',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: 'Valor da conta recorrente' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number

  @ApiProperty({
    description: 'Dia de recorrência mensal',
    minimum: 1,
    maximum: 31
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(31)
  recurrenceDay: number
}
