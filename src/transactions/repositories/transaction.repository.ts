import { Transaction } from '@prisma/client'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'

export abstract class TransactionRepository {
  abstract create(
    userId: string,
    data: CreateTransactionDto
  ): Promise<Transaction>

  abstract find(data: Partial<Transaction>): Promise<Transaction>

  abstract findMany(data: Partial<Transaction>): Promise<Transaction[]>

  abstract update(id: string, data: Partial<Transaction>): Promise<Transaction>

  abstract delete(id: string): Promise<void>
}
