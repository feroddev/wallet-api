import { Prisma, Transaction } from '@prisma/client'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { GetTransactionsDto } from '../infra/http/dto/get-transactions.dto'
import { UpdateTransactionDto } from '../infra/http/dto/update-transaction.dto'

export abstract class TransactionRepository {
  abstract createWithTransaction(
    userId: string,
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient
  ): Promise<Transaction>

  abstract create(data: Partial<Transaction>): Promise<Transaction>

  abstract findMany(userId: string, payload: GetTransactionsDto): Promise<any>

  abstract find(data: Partial<Transaction>): Promise<any>
  
  abstract update(id: string, userId: string, data: UpdateTransactionDto): Promise<Transaction>
  
  abstract delete(id: string, userId: string): Promise<Transaction>
  
  abstract createRecurringTransactions(): Promise<void>
}
