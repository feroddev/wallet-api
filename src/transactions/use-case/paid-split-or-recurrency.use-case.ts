import { Injectable } from '@nestjs/common'
import { SplitOrRecurrenceRepository } from '../repositories/credit-card-expense.repository'

@Injectable()
export class PaidSplitOrRecurrencyUseCase {
  constructor(
    private readonly splitOrRecurrenceRepository: SplitOrRecurrenceRepository
  ) {}

  async execute(id: string, paidAt: Date) {
    return this.splitOrRecurrenceRepository.pay(id, paidAt)
  }
}
