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
    const { categoryId, creditCardId, paymentMethod, type } = payload
    const month =
      new Date(2021, payload.month, 1).getUTCMonth() || new Date().getUTCMonth()
    const year =
      new Date(payload.year, 1, 1).getFullYear() || new Date().getUTCFullYear()
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        },
        ...(categoryId && { categoryId }),
        ...(creditCardId && { creditCardId }),
        ...(paymentMethod && { paymentMethod }),
        ...(type && { type }),
        NOT: {
          paymentMethod: 'CREDIT_CARD',
          splitsOrRecurrences: {
            some: {
              dueDate: {
                gt: endDate
              }
            }
          }
        }
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        creditCard: true
      },
      orderBy: {
        date: 'asc'
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
