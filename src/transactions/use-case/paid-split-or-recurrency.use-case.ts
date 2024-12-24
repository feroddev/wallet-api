import { Injectable } from '@nestjs/common'
import { SplitOrRecurrenceRepository } from '../repositories/split-or-recurrence.repository'

@Injectable()
export class PaidSplitOrRecurrencyUseCase {
  constructor(
    private readonly splitOrRecurrenceRepository: SplitOrRecurrenceRepository
  ) {}

  async execute(id: string, userId: string, paidAt: Date) {
    return this.splitOrRecurrenceRepository.pay(id, userId, paidAt)
  }
}
