import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min
} from 'class-validator'

export class CreateGoalDto {
  @ApiProperty({
    description: 'Nome da meta financeira',
    example: 'Viagem para Europa'
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descrição da meta',
    example: 'Viagem para conhecer Itália e França',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Valor alvo da meta',
    example: 15000
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  @Transform(({ value }) => Number(value))
  targetValue: number

  @ApiProperty({
    description: 'Valor já economizado',
    example: 5000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  savedValue?: number

  @ApiProperty({
    description: 'Data limite para atingir a meta',
    example: '2026-12-31'
  })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  deadline: Date
}
