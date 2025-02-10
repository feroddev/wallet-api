import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { GetInvoicesDto } from '../../../../credit-card/infra/http/dto/get-invoice.dto'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CreditCardExpenseRepository } from '../../../repositories/credit-card-expense.repository'
import { CreditCardExpenseDto } from '../../http/dto/create-credit-card-expense.dto'
import { PaymentMethod, PaymentStatus } from '../../http/dto/enum'

@Injectable()
export class PrismaCreditCardExpenseRepository
  implements CreditCardExpenseRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createWithTransaction(
    data: CreditCardExpenseDto[],
    transaction: Prisma.TransactionClient
  ) {
    return transaction.creditCardExpense.createMany({
      data
    })
  }

  async findMany(creditCardId: string, query: GetInvoicesDto) {
    const { date } = query
    const month = new Date(date).getUTCMonth()
    const year = new Date(date).getUTCFullYear()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const installments = await this.prisma.creditCardExpense.findMany({
      where: {
        creditCardId,
        dueDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    const total = installments.reduce((acc, curr) => {
      return (
        acc +
        Number(curr.amount) *
          (curr.paymentStatus === PaymentStatus.PENDING ? 1 : 0)
      )
    }, 0)

    return {
      total,
      installments
    }
  }

  async payByCreditCard({ creditCardId, paidAt, dueDate }): Promise<any> {
    const month = new Date(dueDate).getUTCMonth()
    const year = new Date(dueDate).getUTCFullYear()
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const bills = await this.prisma.creditCardExpense.findMany({
      where: {
        creditCardId,
        paymentStatus: PaymentStatus.PENDING,
        dueDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        creditCard: {
          select: {
            cardName: true,
            userId: true
          }
        }
      }
    })

    if (!bills.length) {
      return { message: 'No bills to pay' }
    }

    await this.prisma.creditCardExpense.updateMany({
      where: {
        creditCardId,
        dueDate: {
          gte: startDate,
          lte: endDate
        }
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paidAt
      }
    })

    const { id: categoryId } = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: 'Fatura do Cartão'
        }
      },
      select: {
        id: true
      }
    })

    const total = bills.reduce((acc, curr) => {
      return acc + Number(curr.amount)
    }, 0)

    return this.prisma.transaction.create({
      data: {
        userId: bills[0].creditCard.userId,
        date: paidAt,
        name: `Fatura do cartão`,
        description: `Cartão ${bills[0].creditCard.cardName}`,
        paymentMethod: PaymentMethod.INVOICE,
        totalAmount: total,
        type: 'EXPENSE',
        categoryId,
        creditCardId: creditCardId
      }
    })
  }
}
