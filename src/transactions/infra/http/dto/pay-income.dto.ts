import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'

export class PayIncomeDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  paidAt: Date

  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate: Date
}
