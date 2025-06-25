import { ApiProperty } from '@nestjs/swagger'

export class RecurringBillDto {
  @ApiProperty({ description: 'ID da conta recorrente' })
  id: string

  @ApiProperty({ description: 'Nome da conta recorrente' })
  name: string

  @ApiProperty({ description: 'Descrição da conta recorrente' })
  description?: string

  @ApiProperty({ description: 'Valor da conta recorrente' })
  amount: number

  @ApiProperty({ description: 'Dia de recorrência mensal' })
  recurrenceDay: number

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date
}
