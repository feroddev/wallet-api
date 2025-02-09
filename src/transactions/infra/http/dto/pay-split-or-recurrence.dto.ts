import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'

export class PayCreditCardExpenseDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  paidAt: Date
}
