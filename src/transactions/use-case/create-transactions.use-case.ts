import { Injectable } from '@nestjs/common'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { InstallmentRepository } from '../repositories/installment.repository'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class CreateTransactionsUseCase {
  constructor(
    private readonly transactionsRepository: TransactionRepository,
    private readonly installmentsRepository: InstallmentRepository
  ) {}
  async execute(userId: string, data: CreateTransactionDto) {
    const {
      categoryId,
      creditCardId,
      description,
      totalAmount,
      isInstallment,
      totalInstallments,
      isRecurring,
      recurrenceInterval,
      recurrenceStart,
      recurrenceEnd,
      paymentMethod
    } = data

    const transaction = await this.transactionsRepository.create(userId, {
      categoryId,
      creditCardId,
      description,
      totalAmount,
      isInstallment,
      isRecurring,
      recurrenceInterval,
      recurrenceStart,
      recurrenceEnd,
      paymentMethod
    })
  }
}
