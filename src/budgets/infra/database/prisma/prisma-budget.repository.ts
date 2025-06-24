import { Injectable } from '@nestjs/common'
import { Budget } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { BudgetRepository } from '../../../repositories/budget.repository'

@Injectable()
export class PrismaBudgetRepository implements BudgetRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<Budget>): Promise<Budget> {
    return this.prisma.budget.create({
      data: data as any
    })
  }

  async findById(id: string): Promise<Budget | null> {
    return this.prisma.budget.findUnique({
      where: { id }
    })
  }

  async findByUserId(
    userId: string,
    filters?: {
      month?: number
      year?: number
      categoryId?: string
    }
  ): Promise<Budget[]> {
    const where: any = { userId }

    if (filters) {
      if (filters.month !== undefined) {
        where.month = filters.month
      }

      if (filters.year !== undefined) {
        where.year = filters.year
      }

      if (filters.categoryId) {
        where.categoryId = filters.categoryId
      }
    }

    return this.prisma.budget.findMany({
      where,
      orderBy: {
        category: {
          name: 'asc'
        }
      },
      include: {
        category: true
      }
    })
  }

  async findByUserIdWithSpent(
    userId: string,
    filters?: {
      month?: number
      year?: number
      categoryId?: string
    }
  ): Promise<(Budget & { spent: number })[]> {
    const budgets = await this.findByUserId(userId, filters)

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await this.calculateSpentForBudget(budget)
        return {
          ...budget,
          spent
        }
      })
    )

    return budgetsWithSpent
  }

  async update(id: string, data: Partial<Budget>): Promise<Budget> {
    return this.prisma.budget.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.budget.delete({
      where: { id }
    })
  }

  private async calculateSpentForBudget(
    budget: Budget & { month?: number; year?: number }
  ): Promise<number> {
    const { userId, categoryId, month, year } = budget
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const startDate =
      month && year
        ? new Date(year, month - 1, 1)
        : new Date(currentYear, currentMonth - 1, 1)
    const endDate =
      month && year
        ? new Date(year, month, 0)
        : new Date(currentYear, currentMonth, 0, 21)

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        totalAmount: true
      }
    })

    const total = transactions.reduce((sum, transaction) => {
      return sum + Number(transaction.totalAmount)
    }, 0)

    return total
  }
}
