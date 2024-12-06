import { Injectable } from '@nestjs/common'
import { Prisma, Transaction } from '@prisma/client'
import { TransactionRepository } from '../../../repositories/transaction.repository'
import { CreateTransactionDto } from '../../http/dto/create-transaction.dto'
@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor() {}

  async createWithTransaction(
    userId: string,
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient
  ): Promise<Transaction> {
    const { totalInstallments, ...payload } = data
    return transaction.transaction.create({
      data: {
        ...payload,
        userId
      }
    })
  }
}
