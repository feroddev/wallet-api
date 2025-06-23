import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateCreditCardDto {
  @ApiProperty({
    description: 'Nome do cartão de crédito',
    example: 'Nubank'
  })
  @IsString()
  cardName: string

  @ApiProperty({
    description: 'Limite do cartão',
    example: 5000,
    required: false
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number

  @ApiProperty({
    description: 'Dia do fechamento da fatura',
    example: 15
  })
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  closingDay: number

  @ApiProperty({
    description: 'Dia do vencimento da fatura',
    example: 22
  })
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  dueDay: number

  @ApiProperty({
    description: 'Últimos dígitos do cartão',
    example: 1234,
    required: false
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  lastDigits: number
}
