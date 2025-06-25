import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

@Injectable()
export class RecurringBillsService {
  constructor(private prisma: PrismaService) {}

  async getPendingRecurringBillsForMonth(
    userId: string,
    month: number,
    year: number
  ) {
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
      const existingTransaction = await this.prisma.transaction.findFirst({
        where: {
          recurringBillId: bill.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      if (!existingTransaction) {
        // Calcular a data de vencimento para o mês atual
        const dueDate = new Date(
          year,
          month - 1,
          bill.recurrenceDay || bill.dueDate.getDate()
        )

        // Verificar se a data de vencimento está dentro do mês atual
        if (isWithinInterval(dueDate, { start: startDate, end: endDate })) {
          pendingBills.push({
            id: bill.id,
            userId: bill.userId,
            name: bill.name,
            description: bill.description,
            amount: bill.amount,
            dueDate,
            isPaid: bill.isPaid,
            paidAt: bill.paidAt,
            recurrenceDay: bill.recurrenceDay,
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt
          })
        }
      }
    }

    return pendingBills
  }

  async getTotalPendingAmountForMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<number> {
    const pendingBills = await this.getPendingRecurringBillsForMonth(
      userId,
      month,
      year
    )

    return pendingBills.reduce((total, bill) => {
      return total + Number(bill.amount)
    }, 0)
  }
}
