import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min
} from 'class-validator'

export class UpdateBudgetDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Alimentação',
    required: false
  })
  @IsString()
  @IsOptional()
  category?: string

  @ApiProperty({
    description: 'Limite do orçamento',
    example: 800,
    required: false
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number

  @ApiProperty({
    description: 'Mês do orçamento (1-12)',
    example: 6,
    required: false
  })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  month?: number

  @ApiProperty({
    description: 'Ano do orçamento',
    example: 2025,
    required: false
  })
  @IsInt()
  @Min(2000)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  year?: number
}
