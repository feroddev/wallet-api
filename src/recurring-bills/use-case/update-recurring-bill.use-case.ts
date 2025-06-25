import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateRecurringBillDto } from '../dto'
import { RecurringBillRepository } from '../repositories/recurring-bill.repository'

@Injectable()
export class UpdateRecurringBillUseCase {
  constructor(private recurringBillRepository: RecurringBillRepository) {}

  async execute(userId: string, id: string, dto: UpdateRecurringBillDto) {
    const recurringBill = await this.recurringBillRepository.findById(id, userId)

    if (!recurringBill) {
      throw new NotFoundException('Conta recorrente não encontrada')
    }

    return this.recurringBillRepository.update(id, dto)
  }
}
