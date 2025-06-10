import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class DeleteTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string, userId: string) {
    return this.transactionRepository.delete(id, userId)
  }
}
