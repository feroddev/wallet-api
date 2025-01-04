import { Injectable } from '@nestjs/common'
import { Prisma, Transaction } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { TransactionRepository } from '../../../repositories/transaction.repository'
import { CreateTransactionDto } from '../../http/dto/create-transaction.dto'
import { GetTransactionsDto } from '../../http/dto/get-transactions.dto'
@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async findMany(userId: string, payload: GetTransactionsDto): Promise<any> {
    const { categoryId, creditCardId, paymentMethod } = payload
    const month = payload.month || new Date().getUTCMonth() + 1
    const year = payload.year || new Date().getUTCFullYear()

    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0)
        },
        ...(categoryId && { categoryId }),
        ...(creditCardId && { creditCardId }),
        ...(paymentMethod && { paymentMethod })
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        creditCard: true
      }
    })
  }

  async find(data: Partial<Transaction>): Promise<any> {
    return this.prisma.transaction.findFirst({
      where: data,
      include: {
        category: {
          select: {
            name: true
          }
        },
        creditCard: true,
        splitsOrRecurrences: true
      }
    })
  }
}
