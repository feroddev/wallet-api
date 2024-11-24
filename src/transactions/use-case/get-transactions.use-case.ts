import { Injectable } from '@nestjs/common'
import { GetTransactionsDto } from '../infra/http/dto/get-transactions.dto'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class GetTransactionsUseCase {
  constructor(private readonly transactionsRepository: TransactionRepository) {}

  async execute(userId: string, query: GetTransactionsDto) {
    const { categoryId, creditCardId } = query

    const transactions = await this.transactionsRepository.find({
      userId,
      ...(categoryId ? { categoryId } : {}),
      ...(creditCardId ? { creditCardId } : {})
    })

    return transactions
  }
}
