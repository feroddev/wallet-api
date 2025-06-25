import { Injectable } from '@nestjs/common'
import { RecurringBill } from '@prisma/client'
import { PrismaService } from '../../../prisma/prisma.service'
import { CreateRecurringBillDto, UpdateRecurringBillDto } from '../../dto'
import { RecurringBillRepository } from '../recurring-bill.repository'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

@Injectable()
export class PrismaRecurringBillRepository implements RecurringBillRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateRecurringBillDto
  ): Promise<RecurringBill> {
    return this.prisma.recurringBill.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        amount: data.amount,
        recurrenceDay: data.recurrenceDay
      }
    })
  }

  async findAll(userId: string): Promise<RecurringBill[]> {
    return this.prisma.recurringBill.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  }

  async findById(id: string, userId: string): Promise<RecurringBill | null> {
    return this.prisma.recurringBill.findFirst({
      where: {
        id,
        userId
      }
    })
  }

  async update(
    id: string,
    data: UpdateRecurringBillDto
  ): Promise<RecurringBill> {
    return this.prisma.recurringBill.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        amount: data.amount,
        recurrenceDay: data.recurrenceDay
      }
    })
  }

  async delete(id: string): Promise<RecurringBill> {
    return this.prisma.recurringBill.delete({
      where: { id }
    })
  }

  async findPendingForMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<RecurringBill[]> {
    const startDate = startOfMonth(new Date(year, month - 1))
    const endDate = endOfMonth(new Date(year, month - 1))

    // Buscar todas as contas recorrentes do usuário
    const recurringBills = await this.prisma.recurringBill.findMany({
      where: {
        userId
      }
    })

    const pendingBills = []

    for (const bill of recurringBills) {
      // Verificar se já existe uma transação para esta conta neste mês
      const existingTransaction = await this.prisma.transaction.findFirst({
        where: {
          recurringBillId: bill.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      // Se não existir transação ou se existir e não estiver paga, considerar como pendente
      if (!existingTransaction || !existingTransaction.isPaid) {
        pendingBills.push(bill)
      }
    }

    return pendingBills
  }
}
