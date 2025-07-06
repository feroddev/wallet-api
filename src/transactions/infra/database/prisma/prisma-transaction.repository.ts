import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Transaction } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { TransactionRepository } from '../../../repositories/transaction.repository'
import { DateUtils } from '../../../../utils/date.utils'
import { CreateTransactionDto } from '../../http/dto/create-transaction.dto'
import { GetTransactionsDto } from '../../http/dto/get-transactions.dto'
import { UpdateTransactionDto } from '../../http/dto/update-transaction.dto'
import { errors } from '../../../../../constants/errors'
import { UpdateRecurringBillDto } from '../../../../recurring-bills/dto'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Transaction>): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: data as any
    })
  }

  async createWithTransaction({
    userId,
    data,
    transaction
  }: {
    userId: string
    data: CreateTransactionDto
    transaction: Prisma.TransactionClient
  }): Promise<Transaction> {
    const {
      totalInstallments,
      isRecurring,
      creditCardId,
      purchaseId,
      installmentNumber,
      ...payload
    } = data

    return transaction.transaction.create({
      data: {
        ...payload,
        userId,
        isRecurring: isRecurring || false,
        creditCardId,
        purchaseId,
        totalInstallments,
        installmentNumber
      }
    })
  }

  async findMany(userId: string, payload: GetTransactionsDto): Promise<any> {
    const {
      categoryId,
      creditCardId,
      paymentMethod,
      type,
      startDate: inputStartDate,
      endDate: inputEndDate
    } = payload

    // Se não forem fornecidas datas, usa o mês atual como padrão
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const startDate =
      inputStartDate || DateUtils.createLocalDate(currentYear, currentMonth, 1)
    const endDate =
      inputEndDate ||
      DateUtils.createLocalDate(currentYear, currentMonth + 1, 0)

    // Ajusta o horário para incluir todo o período
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

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
        creditCard: true,
        invoice: true,
        recurringBill: true
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
        creditCard: true,
        recurringBill: true
      }
    })
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTransactionDto
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId }
    })

    if (!transaction) {
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
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
        creditCard: true,
        recurringBill: true
      }
    })
  }

  async delete(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId }
    })

    if (!transaction) {
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    }

    return this.prisma.transaction.delete({
      where: { id }
    })
  }

  async findByPurchaseId(
    purchaseId: string,
    userId: string
  ): Promise<Transaction[]> {
    if (!purchaseId) {
      throw new NotFoundException(errors.ID_PURCHASE_NOT_FOUND)
    }

    return this.prisma.transaction.findMany({
      where: {
        purchaseId,
        userId
      },
      orderBy: {
        installmentNumber: 'asc'
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        creditCard: true,
        invoice: true,
        recurringBill: true
      }
    })
  }

  async getDetails(data: { id: string; userId: string }): Promise<any> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: data.id, userId: data.userId },
      include: {
        category: {
          select: {
            name: true
          }
        },
        creditCard: true,
        invoice: true,
        recurringBill: true
      }
    })

    if (!transaction) {
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    }

    if (transaction.installmentNumber > 1) {
      const installments = await this.prisma.transaction.findFirst({
        where: {
          purchaseId: transaction.purchaseId,
          userId: data.userId,
          installmentNumber: 1
        },
        select: {
          date: true
        }
      })

      return {
        ...transaction,
        date: installments.date
      }
    }

    return transaction
  }

  async deleteAllInstallments(
    purchaseId: string,
    userId: string,
    transaction?: Prisma.TransactionClient
  ): Promise<{ count: number }> {
    if (!purchaseId) {
      throw new NotFoundException(errors.ID_PURCHASE_NOT_FOUND)
    }

    // Verificar se as transações existem e pertencem ao usuário
    const transactions = await this.prisma.transaction.findMany({
      where: {
        purchaseId,
        userId
      },
      include: {
        invoice: true
      }
    })

    if (transactions.length === 0) {
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    }

    // Se um cliente de transação foi fornecido, use-o
    const prismaClient = transaction || this.prisma

    // Executar dentro de uma transação se não foi fornecida uma
    if (!transaction) {
      return this.prisma.executeWithExtendedTimeout(() => {
        return this.prisma.$transaction(
          async (tx) => {
            return this._deleteInstallmentsWithTransaction(
              purchaseId,
              userId,
              transactions,
              tx
            )
          },
          {
            timeout: 30000,
            maxWait: 30000
          }
        )
      })
    }

    // Se já estiver em uma transação, use-a diretamente
    return this._deleteInstallmentsWithTransaction(
      purchaseId,
      userId,
      transactions,
      prismaClient
    )
  }

  private async _deleteInstallmentsWithTransaction(
    purchaseId: string,
    userId: string,
    transactions: (Transaction & { invoice: any })[],
    tx: Prisma.TransactionClient
  ): Promise<{ count: number }> {
    // Atualizar os valores totais das faturas
    const invoiceUpdates = new Map<string, number>()

    // Agrupar transações por fatura e calcular valores a deduzir
    transactions.forEach((transaction) => {
      if (transaction.invoiceId) {
        const amount = Number(transaction.totalAmount)
        if (!invoiceUpdates.has(transaction.invoiceId)) {
          invoiceUpdates.set(transaction.invoiceId, amount)
        } else {
          invoiceUpdates.set(
            transaction.invoiceId,
            invoiceUpdates.get(transaction.invoiceId) + amount
          )
        }
      }
    })

    // Atualizar os valores totais das faturas
    for (const [invoiceId, amountToSubtract] of invoiceUpdates.entries()) {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          totalAmount: {
            decrement: amountToSubtract
          }
        }
      })
    }

    // Excluir todas as transações
    const result = await tx.transaction.deleteMany({
      where: {
        purchaseId,
        userId
      }
    })

    return result
  }

  async updateByRecurringBillId(id: string, data: UpdateRecurringBillDto) {
    await this.prisma.transaction.updateMany({
      where: {
        recurringBillId: id,
        date: {
          gte: new Date()
        }
      },
      data: {
        totalAmount: data.amount
      }
    })
  }
}
