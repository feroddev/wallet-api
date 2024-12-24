import { Prisma, Transaction } from '@prisma/client'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { GetTransactionsDto } from '../infra/http/dto/get-transactions.dto'

export abstract class TransactionRepository {
  abstract createWithTransaction(
    userId: string,
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient
  ): Promise<Transaction>

  abstract findMany(userId: string, payload: GetTransactionsDto): Promise<any>

  abstract find(data: Partial<Transaction>): Promise<any>
}
