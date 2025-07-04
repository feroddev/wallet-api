import { Injectable, Logger } from '@nestjs/common'
import * as crypto from 'crypto'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../../prisma/prisma.service'
import { startOfMonth, endOfMonth, format, addMonths } from 'date-fns'
import { DateUtils } from '../../utils/date.utils'
import { TransactionType } from '@prisma/client'

@Injectable()
export class RecurringBillsCron {
  private readonly logger = new Logger(RecurringBillsCron.name)

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_WEEK)
  async processRecurringBills() {
    this.logger.log('Iniciando processamento de contas recorrentes')

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const startDate = startOfMonth(new Date(currentYear, currentMonth, 1))
    const endDate = endOfMonth(new Date(currentYear, currentMonth, 1))

    try {
      // Buscar todas as contas recorrentes
      const recurringBills = await this.prisma.recurringBill.findMany()

      this.logger.log(
        `Encontradas ${recurringBills.length} contas recorrentes para processar`
      )

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

        // Buscar categoria padrão para despesas
        const defaultCategory = await this.prisma.category.findFirst({
          where: {
            type: 'EXPENSE',
            name: 'Contas fixas'
          }
        })

        if (!defaultCategory) {
          this.logger.error(
            `Categoria padrão não encontrada para o usuário ${bill.userId}`
          )
          continue
        }

        if (!existingTransaction) {
          // Criar nova transação para a conta recorrente no mês atual
          const dueDate = DateUtils.createLocalDate(
            currentYear,
            currentMonth,
            bill.recurrenceDay
          )

          await this.prisma.transaction.create({
            data: {
              userId: bill.userId,
              categoryId: defaultCategory.id,
              name: bill.name,
              type: 'EXPENSE',
              description: bill.description,
              paymentMethod: 'BANK_TRANSFER',
              date: dueDate,
              totalAmount: bill.amount,
              isPaid: false,
              isRecurring: true,
              recurringBillId: bill.id
            }
          })

          this.logger.log(
            `Transação criada para conta recorrente: ${bill.name} (${bill.id}) no mês atual`
          )
        } else if (existingTransaction.isPaid) {
          // Se a transação do mês atual já está paga, criar para o próximo mês
          const nextMonth = addMonths(startDate, 1)
          const nextMonthYear = nextMonth.getFullYear()
          const nextMonthMonth = nextMonth.getMonth()

          // Verificar se já existe uma transação para o próximo mês
          const nextMonthTransaction = await this.prisma.transaction.findFirst({
            where: {
              recurringBillId: bill.id,
              date: {
                gte: startOfMonth(nextMonth),
                lte: endOfMonth(nextMonth)
              }
            }
          })

          if (!nextMonthTransaction) {
            // Criar nova transação para o próximo mês
            const nextDueDate = DateUtils.createLocalDate(
              nextMonthYear,
              nextMonthMonth,
              bill.recurrenceDay
            )

            await this.prisma.transaction.create({
              data: {
                userId: bill.userId,
                categoryId: defaultCategory.id,
                name: bill.name,
                type: 'EXPENSE',
                description: bill.description,
                paymentMethod: 'BANK_TRANSFER',
                date: nextDueDate,
                totalAmount: bill.amount,
                isPaid: false,
                isRecurring: true,
                recurringBillId: bill.id
              }
            })

            this.logger.log(
              `Transação criada para conta recorrente: ${bill.name} (${bill.id}) para o próximo mês`
            )
          }
        } else {
          this.logger.log(
            `Transação já existe para conta recorrente: ${bill.name} (${bill.id})`
          )
        }
      }

      this.logger.log(
        'Processamento de contas recorrentes concluído com sucesso'
      )
    } catch (error) {
      this.logger.error(
        `Erro ao processar contas recorrentes: ${error.message}`,
        error.stack
      )
    }
  }
}
