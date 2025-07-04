import { Injectable, NotFoundException } from '@nestjs/common'
import { TransactionRepository } from '../repositories/transaction.repository'
import { RecurringBillRepository } from '../../recurring-bills/repositories/recurring-bill.repository'
import { DateUtils } from '../../utils/date.utils'
import { addMonths, startOfMonth, endOfMonth } from 'date-fns'
import { errors } from '../../../constants/errors'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class PayTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(id: string, userId: string) {
    const transaction = await this.transactionRepository.find({
      id,
      userId
    })

    if (!transaction) {
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    }

    if (transaction.isPaid) {
      return {
        message: 'Transação já está paga',
        transaction
      }
    }

    // Usar transação do Prisma para garantir consistência
    const result = await this.prisma.$transaction(async (prismaTransaction) => {
      // Atualizar a transação para paga
      const updatedTransaction = await prismaTransaction.transaction.update({
        where: { id },
        data: {
          isPaid: true
        },
        include: {
          category: {
            select: {
              name: true
            }
          },
          creditCard: true
        }
      })

      // Se for uma transação de conta recorrente, verificar se deve criar a próxima
      if (transaction.isRecurring && transaction.recurringBillId) {
        // Buscar categoria padrão para despesas
        const defaultCategory = await prismaTransaction.category.findFirst({
          where: {
            type: 'EXPENSE',
            name: 'Contas fixas'
          }
        })

        if (defaultCategory) {
          // Obter a data da transação atual
          const currentDate = DateUtils.fromDate(transaction.date)
          const nextMonth = addMonths(currentDate, 1)

          // Verificar se já existe uma transação para o próximo mês
          const nextMonthTransaction =
            await prismaTransaction.transaction.findFirst({
              where: {
                recurringBillId: transaction.recurringBillId,
                date: {
                  gte: startOfMonth(nextMonth),
                  lte: endOfMonth(nextMonth)
                }
              }
            })

          // Se não existir transação para o próximo mês, criar uma
          if (!nextMonthTransaction) {
            // Buscar a conta recorrente
            const recurringBill =
              await prismaTransaction.recurringBill.findUnique({
                where: { id: transaction.recurringBillId }
              })

            if (recurringBill) {
              // Criar nova transação para o próximo mês
              await prismaTransaction.transaction.create({
                data: {
                  userId: transaction.userId,
                  categoryId: defaultCategory.id,
                  name: transaction.name,
                  type: 'EXPENSE',
                  description: transaction.description,
                  paymentMethod: transaction.paymentMethod,
                  date: new Date(
                    nextMonth.getFullYear(),
                    nextMonth.getMonth(),
                    recurringBill.recurrenceDay
                  ),
                  totalAmount: transaction.totalAmount,
                  isPaid: false,
                  isRecurring: true,
                  recurringBillId: transaction.recurringBillId
                }
              })
            }
          }
        }
      }

      return updatedTransaction
    })

    return {
      message: 'Transação paga com sucesso',
      transaction: result
    }
  }
}
