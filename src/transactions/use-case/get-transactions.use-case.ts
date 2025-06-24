import { Injectable } from '@nestjs/common'
import { GetTransactionsDto } from '../infra/http/dto/get-transactions.dto'
import { TransactionRepository } from '../repositories/transaction.repository'
import { TransactionType } from '../infra/http/dto/enum'

@Injectable()
export class GetTransactionsUseCase {
  constructor(private readonly transactionsRepository: TransactionRepository) {}

  async execute(userId: string, payload: GetTransactionsDto) {
    const transactions = await this.transactionsRepository.findMany(
      userId,
      payload
    )

    const balance = transactions.reduce((total: number, transaction: any) => {
      const amount = Number(transaction.totalAmount)

      if (transaction.type === TransactionType.INCOME) {
        return total + amount
      } else if (
        transaction.type === TransactionType.EXPENSE ||
        transaction.type === TransactionType.INVESTMENT
      ) {
        return total - amount
      }
      return total
    }, 0)

    const income = transactions
      .filter((transaction) => transaction.type === TransactionType.INCOME)
      .reduce((total: number, transaction: any) => {
        return total + Number(transaction.totalAmount)
      }, 0)

    const expense = transactions
      .filter((transaction) => transaction.type === TransactionType.EXPENSE)
      .reduce((total: number, transaction: any) => {
        return total + Number(transaction.totalAmount)
      }, 0)

    const investment = transactions
      .filter((transaction) => transaction.type === TransactionType.INVESTMENT)
      .reduce((total: number, transaction: any) => {
        return total + Number(transaction.totalAmount)
      }, 0)

    return {
      transactions,
      total: {
        balance,
        income,
        expense,
        investment
      }
    }
  }
}
