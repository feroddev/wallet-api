import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class CreateRecurringTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute() {
    return this.transactionRepository.createRecurringTransactions()
  }
}
