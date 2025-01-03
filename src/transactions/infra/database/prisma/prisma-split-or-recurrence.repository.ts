import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { GetInvoicesDto } from '../../../../credit-card/infra/http/dto/get-invoice.dto'
import { PrismaService } from '../../../../prisma/prisma.service'
import { SplitOrRecurrenceRepository } from '../../../repositories/split-or-recurrence.repository'
import { SplitOrRecurrenceDto } from '../../http/dto/create-split-or-recurrence.dto'
import { PaymentStatus } from '../../http/dto/enum'

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

  async pay(id: string, userId: string, paidAt: Date) {
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
}
