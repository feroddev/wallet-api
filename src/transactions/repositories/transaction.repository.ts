import { Prisma, Transaction } from '@prisma/client'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'

export abstract class TransactionRepository {
  abstract createWithTransaction(
    userId: string,
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient
  ): Promise<Transaction>
}
