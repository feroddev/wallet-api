import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateRecurringBillDto } from '../dto'
import { RecurringBillRepository } from '../repositories/recurring-bill.repository'
import { TransactionRepository } from '../../transactions/repositories/transaction.repository'

@Injectable()
export class UpdateRecurringBillUseCase {
  constructor(
    private recurringBillRepository: RecurringBillRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute(userId: string, id: string, dto: UpdateRecurringBillDto) {
    const recurringBill = await this.recurringBillRepository.findById(
      id,
      userId
    )

    if (!recurringBill) {
      throw new NotFoundException('Conta recorrente não encontrada')
    }

    const updatedRecurringBill = await this.recurringBillRepository.update(
      id,
      dto
    )

    await this.transactionRepository.updateByRecurringBillId(id, dto)

    return updatedRecurringBill
  }
}
