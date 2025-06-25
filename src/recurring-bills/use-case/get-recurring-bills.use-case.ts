import { Injectable } from '@nestjs/common'
import { RecurringBillRepository } from '../repositories/recurring-bill.repository'

@Injectable()
export class GetRecurringBillsUseCase {
  constructor(private recurringBillRepository: RecurringBillRepository) {}

  async execute(userId: string) {
    return this.recurringBillRepository.findAll(userId)
  }
}
