import { Transaction } from '@prisma/client'

export abstract class TransactionRepository {
  abstract create(data: Transaction): Promise<Transaction>

  abstract find(data: Partial<Transaction>): Promise<Transaction[]>

  abstract findMany(data: Partial<Transaction>): Promise<Transaction[]>

  abstract update(id: string, data: Partial<Transaction>): Promise<Transaction>

  abstract delete(id: string): Promise<void>
}
