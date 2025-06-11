import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class GetBudgetsDto {
  @ApiProperty({
    description: 'Mês para filtrar orçamentos (1-12)',
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
    description: 'Ano para filtrar orçamentos',
    example: 2025,
    required: false
  })
  @IsInt()
  @Min(2000)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  year?: number
}
