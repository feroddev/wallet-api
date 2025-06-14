import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min
} from 'class-validator'

export class CreateBudgetDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Alimentação'
  })
  @IsNotEmpty()
  @IsString()
  category: string

  @ApiProperty({
    description: 'Limite do orçamento',
    example: 800
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  @Transform(({ value }) => Number(value))
  limit: number

  @ApiProperty({
    description: 'Mês do orçamento (1-12)',
    example: 6
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  @Transform(({ value }) => Number(value))
  month: number

  @ApiProperty({
    description: 'Ano do orçamento',
    example: 2025
  })
  @IsNotEmpty()
  @IsInt()
  @Min(2000)
  @Transform(({ value }) => Number(value))
  year: number
}
