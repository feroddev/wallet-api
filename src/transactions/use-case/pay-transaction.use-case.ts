import { Injectable, NotFoundException } from '@nestjs/common'
import { TransactionRepository } from '../repositories/transaction.repository'
import { errors } from '../../../constants/errors'

@Injectable()
export class PayTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string, userId: string) {
    const transaction = await this.transactionRepository.find({
      id,
      userId
    })

    if (!transaction) {
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    }

    if (transaction.isPaid) {
      return {
        message: 'Transação já está paga',
        transaction
      }
    }

    const updatedTransaction = await this.transactionRepository.update(
      id,
      userId,
      {
        isPaid: true
      }
    )

    return {
      message: 'Transação paga com sucesso',
      transaction: updatedTransaction
    }
  }
}
