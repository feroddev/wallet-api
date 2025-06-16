import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { endOfMonth, startOfMonth } from 'date-fns'

interface GetDashboardRequest {
  userId: string
}

@Injectable()
export class GetDashboardUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(request: GetDashboardRequest) {
    const { userId } = request

    const now = new Date()
    const startMonth = startOfMonth(now)
    const endMonth = endOfMonth(now)

    const financialSummary = await this.getFinancialSummary(
      userId,
      startMonth,
      endMonth
    )

    const recentTransactions = await this.getRecentTransactions(
      userId,
      startMonth,
      endMonth
    )

    const budgets = await this.getBudgets(
      userId,
      now.getMonth() + 1,
      now.getFullYear()
    )

    const expensesByCategory = await this.getExpensesByCategory(
      userId,
      startMonth,
      endMonth
    )

    const nextCreditCardInvoice = await this.getNextCreditCardInvoice(
      userId,
      startMonth,
      endMonth
    )

    const financialGoals = await this.getFinancialGoals(userId)

    return {
      financialSummary,
      recentTransactions,
      budgets,
      expensesByCategory,
      nextCreditCardInvoice,
      financialGoals
    }
  }

  private async getFinancialSummary(
    userId: string,
    startMonth: Date,
    endMonth: Date
  ) {
    const incomeResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INCOME',
        isPaid: true,
        date: {
          gte: startMonth,
          lte: endMonth
        }
      },
      _sum: {
        totalAmount: true
      }
    })

    const monthlyIncome = Number(incomeResult._sum.totalAmount || 0)

    const expensesResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startMonth,
          lte: endMonth
        }
      },
      _sum: {
        totalAmount: true
      }
    })

    const monthlyExpenses = Number(expensesResult._sum.totalAmount || 0)

    const investmentsResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INVESTMENT',
        date: {
          gte: startMonth,
          lte: endMonth
        }
      },
      _sum: {
        totalAmount: true
      }
    })

    const investments = Number(investmentsResult._sum.totalAmount || 0)

    const incomeTotal = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INCOME'
      },
      _sum: {
        totalAmount: true
      }
    })

    const expenseTotal = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE'
      },
      _sum: {
        totalAmount: true
      }
    })

    const investmentTotal = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INVESTMENT'
      },
      _sum: {
        totalAmount: true
      }
    })

    const balance =
      Number(incomeTotal._sum.totalAmount || 0) -
      Number(expenseTotal._sum.totalAmount || 0) -
      Number(investmentTotal._sum.totalAmount || 0)

    return {
      monthlyIncome,
      monthlyExpenses,
      investments,
      balance
    }
  }

  private async getRecentTransactions(
    userId: string,
    startMonth: Date,
    endMonth: Date
  ) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startMonth,
          lte: endMonth
        }
      },
      select: {
        id: true,
        totalAmount: true,
        name: true,
        date: true,
        description: true,
        type: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
    })

    return transactions.map((transaction) => ({
      id: transaction.id,
      amount: Number(transaction.totalAmount),
      name: transaction.name,
      date: transaction.date.toISOString(),
      description: transaction.description || '',
      category: transaction.category.name,
      type: transaction.type
    }))
  }

  private async getBudgets(userId: string, month: number, year: number) {
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        month,
        year
      }
    })

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await this.calculateSpentForBudget(
          userId,
          budget.category,
          month,
          year
        )
        const limit = Number(budget.limit)
        const percentage = limit > 0 ? (spent / limit) * 100 : 0
        const available = Math.max(0, limit - spent)

        return {
          id: budget.id,
          category: budget.category,
          limit,
          spent,
          percentage,
          available
        }
      })
    )

    return budgetsWithSpent
  }

  private async calculateSpentForBudget(
    userId: string,
    category: string,
    month: number,
    year: number
  ): Promise<number> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate
        },
        category: {
          name: category
        }
      },
      select: {
        totalAmount: true
      }
    })

    return transactions.reduce((total, transaction) => {
      return total + Number(transaction.totalAmount)
    }, 0)
  }

  private async getExpensesByCategory(
    userId: string,
    startMonth: Date,
    endMonth: Date
  ) {
    const transactions = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startMonth,
          lte: endMonth
        }
      },
      _sum: {
        totalAmount: true
      }
    })

    // Buscar os nomes das categorias
    const categoryIds = transactions.map((t) => t.categoryId)
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: categoryIds }
      },
      select: {
        id: true,
        name: true
      }
    })

    // Mapear os resultados
    const expensesByCategory = transactions
      .map((t) => {
        const category = categories.find((c) => c.id === t.categoryId)
        return {
          category: category?.name || 'Sem categoria',
          amount: Number(t._sum.totalAmount || 0)
        }
      })
      .sort((a, b) => b.amount - a.amount)

    // Calcular o total de despesas
    const totalExpenses = expensesByCategory.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    )

    return expensesByCategory.map((item) => ({
      category: item.category,
      amount: Number(item.amount),
      percentage:
        totalExpenses !== 0 ? (Number(item.amount) / totalExpenses) * 100 : 0
    }))
  }

  private async getNextCreditCardInvoice(
    userId: string,
    startMonth: Date,
    endMonth: Date
  ) {
    // Buscar todos os cartões do usuário
    const creditCards = await this.prisma.creditCard.findMany({
      where: {
        userId
      }
    })

    if (creditCards.length === 0) {
      return null
    }

    const invoicesPromises = creditCards.map(async (card) => {
      const invoice = await this.prisma.invoice.findFirst({
        where: {
          creditCardId: card.id,
          dueDate: {
            gte: startMonth,
            lte: endMonth
          }
        },
        orderBy: {
          dueDate: 'asc'
        },
        include: {
          creditCard: true
        }
      })

      if (!invoice) return null

      return {
        id: invoice.id,
        cardName: invoice.creditCard.cardName,
        dueDate: invoice.dueDate.toISOString(),
        totalAmount: Number(invoice.totalAmount),
        isPaid: invoice.isPaid
      }
    })

    const invoices = await Promise.all(invoicesPromises)

    const validInvoices = invoices.filter((invoice) => invoice !== null)

    if (validInvoices.length === 0) return null

    return validInvoices
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 2)
  }

  private async getFinancialGoals(userId: string) {
    const goals = await this.prisma.goal.findMany({
      where: {
        userId
      },
      orderBy: {
        deadline: 'asc'
      }
    })

    return goals.map((goal) => ({
      id: goal.id,
      title: goal.name,
      targetAmount: Number(goal.targetValue),
      currentAmount: Number(goal.savedValue),
      deadline: goal.deadline.toISOString(),
      icon: '🎯' // Emoji padrão para meta
    }))
  }
}
