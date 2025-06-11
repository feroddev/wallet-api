import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class UpdateProgressDto {
  @ApiProperty({
    description: 'Valor a ser adicionado ao progresso da meta',
    example: 500
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  amount: number
}
