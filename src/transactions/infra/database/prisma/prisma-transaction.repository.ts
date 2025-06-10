import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Transaction } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { TransactionRepository } from '../../../repositories/transaction.repository'
import { CreateTransactionDto } from '../../http/dto/create-transaction.dto'
import { GetTransactionsDto } from '../../http/dto/get-transactions.dto'
import { UpdateTransactionDto } from '../../http/dto/update-transaction.dto'
@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Transaction>): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: data as any
    })
  }

  async createWithTransaction(
    userId: string,
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient
  ): Promise<Transaction> {
    const { totalInstallments, isRecurring, creditCardId, ...payload } = data

    return transaction.transaction.create({
      data: {
        ...payload,
        userId,
        isRecurring: isRecurring || false,
        creditCardId
      }
    })
  }

  async findMany(userId: string, payload: GetTransactionsDto): Promise<any> {
    const { categoryId, creditCardId, paymentMethod, type } = payload
    const date = payload.date || new Date()
    const month = new Date(date).getUTCMonth()
    const year = new Date(date).getUTCFullYear()

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
        ...(type && { type })
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
        creditCard: true
      }
    })
  }

  async update(id: string, userId: string, data: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId }
    })

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada')
    }

    return this.prisma.transaction.update({
      where: { id },
      data,
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

  async delete(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId }
    })

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada')
    }

    return this.prisma.transaction.delete({
      where: { id }
    })
  }

  async createRecurringTransactions(): Promise<void> {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    const firstDayLastMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDayLastMonth = new Date(currentYear, currentMonth, 0)

    const recurringTransactions = await this.prisma.transaction.findMany({
      where: {
        isRecurring: true,
        date: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth
        }
      }
    })

    for (const transaction of recurringTransactions) {
      const newDate = new Date(transaction.date)
      newDate.setMonth(newDate.getMonth() + 1)

      await this.prisma.transaction.create({
        data: {
          name: transaction.name,
          description: transaction.description,
          type: transaction.type,
          categoryId: transaction.categoryId,
          totalAmount: transaction.totalAmount,
          paymentMethod: transaction.paymentMethod,
          date: newDate,
          userId: transaction.userId,
          isRecurring: true,
          isPaid: false,
          creditCardId: transaction.creditCardId,
          invoiceId: transaction.invoiceId
        }
      })
    }
  }
}
