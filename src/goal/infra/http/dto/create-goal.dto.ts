import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'

export class CreateGoalDto {
  @ApiProperty({
    description: 'Nome da meta',
    example: 'Reserva de Emergência'
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descrição da meta',
    example: 'Guardar dinheiro para imprevistos',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'Valor alvo da meta',
    example: 5000
  })
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  targetValue: number

  @ApiProperty({
    description: 'Data limite para atingir a meta',
    example: '2025-12-31T00:00:00.000Z'
  })
  @IsDateString()
  deadline: Date
}
