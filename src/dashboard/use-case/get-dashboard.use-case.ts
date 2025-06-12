import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { endOfMonth, startOfMonth, addMonths } from 'date-fns'
import { Decimal } from '@prisma/client/runtime/library'

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

    // Obter próxima fatura de cartão de crédito
    const nextCreditCardInvoice = await this.getNextCreditCardInvoice(userId)

    // Obter metas financeiras
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

    const investmentsResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        isPaid: true,
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

    const balanceResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        isPaid: true,
      },
      _sum: {
        totalAmount: true
      }
    })

    const balance = Number(balanceResult._sum.totalAmount || 0)

    return {
      monthlyIncome,
      monthlyExpenses,
      investments,
      balance
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
      },

    })

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await this.calculateSpentForBudget(userId, budget.category, month, year)
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
    let totalExpenses = 0
    
    expenses.forEach(expense => {
      const categoryId = expense.category.id
      const amount = Number(expense.totalAmount)
      totalExpenses += amount
      
      if (!expensesByCategory[categoryId]) {
        expensesByCategory[categoryId] = {
          category: expense.category.name,
          amount: 0,
          color: this.getRandomColor(expense.category.name)
        }
      }
      
      expensesByCategory[categoryId].amount += amount
    })

    // Calcular percentuais
    const result = Object.values(expensesByCategory).map((category: any) => ({
      category: category.category,
      amount: category.amount,
      color: category.color,
      percentage: totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0
    }))

    // Ordenar por valor (do maior para o menor)
    return result.sort((a, b) => b.amount - a.amount)
  }

  private getRandomColor(seed: string): string {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC249', '#EA5F89', '#00D8B6', '#FFB88C'
    ]
    
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    
    return colors[index]
  }

  private async getNextCreditCardInvoice(userId: string) {
    // Buscar todos os cartões do usuário
    const creditCards = await this.prisma.creditCard.findMany({
      where: {
        userId
      }
    })

    if (creditCards.length === 0) {
      return null
    }

    // Para cada cartão, buscar a próxima fatura
    const invoicesPromises = creditCards.map(async (card) => {
      const now = new Date()

      // Buscar a fatura atual ou próxima
      const invoice = await this.prisma.invoice.findFirst({
        where: {
          creditCardId: card.id,
          dueDate: {
            gte: now
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
        dueDate: invoice.dueDate,
        totalAmount: Number(invoice.totalAmount),
        isPaid: invoice.isPaid
      }
    })

    const invoices = await Promise.all(invoicesPromises)
    const validInvoices = invoices.filter(invoice => invoice !== null)

    // Ordenar por data de vencimento e retornar a mais próxima
    if (validInvoices.length === 0) return null

    return validInvoices.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )[0]
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

    return goals.map(goal => ({
      id: goal.id,
      title: goal.name,
      targetAmount: Number(goal.targetValue),
      currentAmount: Number(goal.savedValue),
      deadline: goal.deadline,
      icon: '🎯' // Emoji padrão para meta
    }))
  }
}
