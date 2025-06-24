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
  categoryId: string

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
}
