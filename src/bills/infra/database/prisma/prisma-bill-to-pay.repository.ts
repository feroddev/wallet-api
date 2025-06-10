import { Injectable } from '@nestjs/common'
import { BillToPay } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { BillToPayRepository } from '../../../repositories/bill-to-pay.repository'
import { addMonths } from 'date-fns'

@Injectable()
export class PrismaBillToPayRepository implements BillToPayRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<BillToPay>): Promise<BillToPay> {
    return this.prisma.billToPay.create({
      data: data as any
    })
  }

  async findById(id: string): Promise<BillToPay | null> {
    return this.prisma.billToPay.findUnique({
      where: { id }
    })
  }

  async findByUserId(
    userId: string,
    filters?: {
      isPaid?: boolean
      isRecurring?: boolean
      dueDateStart?: Date
      dueDateEnd?: Date
    }
  ): Promise<BillToPay[]> {
    const where: any = { userId }

    if (filters) {
      if (filters.isPaid !== undefined) {
        where.isPaid = filters.isPaid
      }

      if (filters.isRecurring !== undefined) {
        where.isRecurring = filters.isRecurring
      }

      if (filters.dueDateStart && filters.dueDateEnd) {
        where.dueDate = {
          gte: filters.dueDateStart,
          lte: filters.dueDateEnd
        }
      } else if (filters.dueDateStart) {
        where.dueDate = {
          gte: filters.dueDateStart
        }
      } else if (filters.dueDateEnd) {
        where.dueDate = {
          lte: filters.dueDateEnd
        }
      }
    }

    return this.prisma.billToPay.findMany({
      where,
      orderBy: {
        dueDate: 'asc'
      }
    })
  }

  async update(id: string, data: Partial<BillToPay>): Promise<BillToPay> {
    return this.prisma.billToPay.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.billToPay.delete({
      where: { id }
    })
  }

  async markAsPaid(id: string): Promise<BillToPay> {
    const now = new Date()
    
    return this.prisma.billToPay.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: now
      }
    })
  }

  async createRecurringBill(originalBill: BillToPay): Promise<BillToPay> {
    const nextDueDate = new Date(originalBill.dueDate)
    
    if (originalBill.recurrenceDay) {
      const nextMonth = addMonths(nextDueDate, 1)
      nextDueDate.setMonth(nextMonth.getMonth())
      nextDueDate.setFullYear(nextMonth.getFullYear())
      nextDueDate.setDate(originalBill.recurrenceDay)
    } else {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    }

    return this.prisma.billToPay.create({
      data: {
        userId: originalBill.userId,
        name: originalBill.name,
        description: originalBill.description,
        amount: originalBill.amount,
        dueDate: nextDueDate,
        isPaid: false,
        isRecurring: originalBill.isRecurring,
        recurrenceDay: originalBill.recurrenceDay
      }
    })
  }
}
