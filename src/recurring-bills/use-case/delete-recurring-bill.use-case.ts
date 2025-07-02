import { Injectable, NotFoundException } from '@nestjs/common'
import { RecurringBillRepository } from '../repositories/recurring-bill.repository'

@Injectable()
export class DeleteRecurringBillUseCase {
  constructor(private recurringBillRepository: RecurringBillRepository) {}

  async execute(userId: string, id: string) {
    const recurringBill = await this.recurringBillRepository.findById(
      id,
      userId
    )

    if (!recurringBill) {
      throw new NotFoundException('Conta recorrente não encontrada')
    }

    return this.recurringBillRepository.delete(id)
  }
}
