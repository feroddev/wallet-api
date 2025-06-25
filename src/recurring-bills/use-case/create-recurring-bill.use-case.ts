import { Injectable } from '@nestjs/common'
import { CreateRecurringBillDto } from '../dto'
import { RecurringBillRepository } from '../repositories/recurring-bill.repository'

@Injectable()
export class CreateRecurringBillUseCase {
  constructor(private recurringBillRepository: RecurringBillRepository) {}

  async execute(userId: string, dto: CreateRecurringBillDto) {
    return this.recurringBillRepository.create(userId, dto)
  }
}
