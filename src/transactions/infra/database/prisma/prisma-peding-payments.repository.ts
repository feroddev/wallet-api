import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { GetBillsDto } from '../../../../credit-card/infra/http/dto/get-bills.dto'
import { PrismaService } from '../../../../prisma/prisma.service'
import { PendingPaymentsRepository } from '../../../repositories/pending-payments.repository'
import { CreatePendingPaymentDto } from '../../http/dto/create-pending-payment.dto'
import { PaymentStatus } from '../../http/dto/enum'

@Injectable()
export class PrismaPendingPaymentsRepository
  implements PendingPaymentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createWithTransaction(
    data: CreatePendingPaymentDto[],
    transaction: Prisma.TransactionClient
  ) {
    return transaction.pendingPayment.createMany({
      data
    })
  }

  async findBills(userId: string, query: GetBillsDto) {
    const { date } = query
    const month = new Date(date).getUTCMonth()
    const year = new Date(date).getUTCFullYear()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const installments = await this.prisma.pendingPayment.findMany({
      where: {
        userId,
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
        Number(curr.totalAmount) *
          (curr.status === PaymentStatus.PENDING ? 1 : 0)
      )
    }, 0)

    return {
      total,
      installments
    }
  }
}
