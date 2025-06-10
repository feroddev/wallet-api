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

    // Obter resumo financeiro
    const financialSummary = await this.getFinancialSummary(userId, startMonth, endMonth)
    
    // Obter transações recentes
    const recentTransactions = await this.getRecentTransactions(userId, startMonth, endMonth)
    
    // Obter orçamentos
    const budgets = await this.getBudgets(userId, now.getMonth() + 1, now.getFullYear())
    
    // Obter despesas por categoria
    const expensesByCategory = await this.getExpensesByCategory(userId, startMonth, endMonth)

    return {
      financialSummary,
      recentTransactions,
      budgets,
      expensesByCategory
    }
  }

  private async getFinancialSummary(userId: string, startMonth: Date, endMonth: Date) {
    // Obter receitas do mês
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

    // Obter despesas do mês (excluindo cartão de crédito)
    const expensesResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        isPaid: true,
        creditCardId: null,
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

    // Obter investimentos
    const investmentsResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        isPaid: true,
        category: {
          name: 'Investimentos'
        },
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

    return {
      monthlyIncome,
      monthlyExpenses,
      investments,
      totalBalance: monthlyIncome - monthlyExpenses
    }
  }

  private async getRecentTransactions(userId: string, startMonth: Date, endMonth: Date) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        isPaid: true,
        date: {
          gte: startMonth,
          lte: endMonth
        }
      },
      select: {
        id: true,
        totalAmount: true,
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
        date: 'desc'
      },
      take: 5
    })

    return transactions.map(transaction => ({
      id: transaction.id,
      amount: Number(transaction.totalAmount),
      date: transaction.date,
      description: transaction.description,
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
        const spent = await this.calculateSpentForBudget(userId, budget.category, month, year)
        
        return {
          id: budget.id,
          name: budget.category,
          budgeted: Number(budget.limit),
          spent
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
        categoryId: category,
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

    return transactions.reduce((sum, transaction) => {
      return sum + Number(transaction.totalAmount)
    }, 0)
  }

  private async getExpensesByCategory(userId: string, startMonth: Date, endMonth: Date) {
    const expenses = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        isPaid: true,
        creditCardId: null,
        date: {
          gte: startMonth,
          lte: endMonth
        }
      },
      select: {
        totalAmount: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const expensesByCategory = {}
    
    expenses.forEach(expense => {
      const categoryId = expense.category.id
      
      if (!expensesByCategory[categoryId]) {
        expensesByCategory[categoryId] = {
          name: expense.category.name,
          value: 0,
          color: this.getRandomColor(expense.category.name)
        }
      }
      
      expensesByCategory[categoryId].value += Number(expense.totalAmount)
    })

    return Object.values(expensesByCategory)
  }

  private getRandomColor(seed: string): string {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC249', '#EA5F89', '#00D8B6', '#FFB88C'
    ]
    
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    
    return colors[index]
  }
}
