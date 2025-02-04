import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { GetBillsDto } from '../../../../credit-card/infra/http/dto/get-bills.dto'
import { GetInvoicesDto } from '../../../../credit-card/infra/http/dto/get-invoice.dto'
import { PrismaService } from '../../../../prisma/prisma.service'
import { SplitOrRecurrenceRepository } from '../../../repositories/split-or-recurrence.repository'
import { SplitOrRecurrenceDto } from '../../http/dto/create-split-or-recurrence.dto'
import { PaymentMethod, PaymentStatus } from '../../http/dto/enum'

@Injectable()
export class PrismaSplitOrRecurrenceRepository
  implements SplitOrRecurrenceRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createWithTransaction(
    data: SplitOrRecurrenceDto[],
    transaction: Prisma.TransactionClient
  ) {
    return transaction.splitOrRecurrence.createMany({
      data
    })
  }

  async findMany(userId: string, creditCardId: string, query: GetInvoicesDto) {
    const { date } = query
    const month = new Date(date).getUTCMonth()
    const year = new Date(date).getUTCFullYear()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const installments = await this.prisma.transaction.findMany({
      where: {
        userId,
        creditCardId,
        splitsOrRecurrences: {
          some: {
            dueDate: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      },
      include: {
        splitsOrRecurrences: {
          where: {
            dueDate: {
              gte: startDate,
              lte: endDate
            }
          }
        },
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
        curr.splitsOrRecurrences.reduce((acc, curr) => {
          return acc + Number(curr.amount)
        }, 0)
      )
    }, 0)

    return {
      total,
      installments
    }
  }

  async pay(id: string, paidAt: Date) {
    return this.prisma.splitOrRecurrence.update({
      where: {
        id
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paidAt: paidAt
      }
    })
  }

  async payByCreditCard({ creditCardId, paidAt, dueDate }): Promise<any> {
    const month = new Date(dueDate).getUTCMonth()
    const year = new Date(dueDate).getUTCFullYear()
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const bills = await this.prisma.splitOrRecurrence.findMany({
      where: {
        creditCardId,
        paymentStatus: PaymentStatus.PENDING,
        dueDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        transaction: {
          select: {
            userId: true
          }
        },
        creditCard: {
          select: {
            cardName: true
          }
        }
      }
    })

    if (!bills.length) {
      return { message: 'No bills to pay' }
    }

    await this.prisma.splitOrRecurrence.updateMany({
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
          equals: 'Despesas Diversas'
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
        userId: bills[0].transaction.userId,
        date: paidAt,
        name: `Fatura do cartão`,
        description: `Cartão ${bills[0].creditCard.cardName}`,
        paymentMethod: PaymentMethod.INVOICE,
        totalAmount: total,
        type: 'EXPENSE',
        categoryId
      }
    })
  }

  async findBills(userId: string, query: GetBillsDto) {
    const { date } = query
    const month = new Date(date).getUTCMonth()
    const year = new Date(date).getUTCFullYear()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const installments = await this.prisma.transaction.findMany({
      where: {
        userId,
        splitsOrRecurrences: {
          some: {
            dueDate: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        paymentMethod: PaymentMethod.BANK_SLIP
      },
      include: {
        splitsOrRecurrences: {
          where: {
            dueDate: {
              gte: startDate,
              lte: endDate
            }
          }
        },
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
        curr.splitsOrRecurrences.reduce((acc, curr) => {
          return acc + Number(curr.amount)
        }, 0)
      )
    }, 0)

    return {
      total,
      installments
    }
  }
}
