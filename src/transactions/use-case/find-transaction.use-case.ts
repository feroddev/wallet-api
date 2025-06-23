import { Injectable, NotFoundException } from '@nestjs/common'
import { errors } from '../../../constants/errors'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class FindTransactionUseCase {
  constructor(private readonly transactionsRepository: TransactionRepository) {}

  async execute(id: string, userId: string) {
    const transaction = await this.transactionsRepository.getDetails({
      id,
      userId
    })

    if (!transaction) {
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    }

    return transaction
  }
}
