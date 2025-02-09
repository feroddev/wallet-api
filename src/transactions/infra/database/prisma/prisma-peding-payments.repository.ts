import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { errors } from '../../../../../constants/errors'
import { GetBillsDto } from '../../../../credit-card/infra/http/dto/get-bills.dto'
import { PrismaService } from '../../../../prisma/prisma.service'
import { PendingPaymentsRepository } from '../../../repositories/pending-payments.repository'
import { CreatePendingPaymentDto } from '../../http/dto/create-pending-payment.dto'
import { PaymentStatus, TransactionType } from '../../http/dto/enum'

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
      data: {
        ...data,
        paymentMethod: 'BANK_SLIP'
      }
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

  async payPendingPayment(id: string, paidAt: Date): Promise<any> {
    const pendingPayments = await this.prisma.pendingPayment.findFirst({
      where: {
        id
      }
    })

    if (!pendingPayments) {
      throw new NotFoundException(errors.PENDING_PAYMENT_NOT_FOUND)
    }

    await this.prisma.pendingPayment.update({
      where: {
        id
      },
      data: {
        status: PaymentStatus.PAID,
        paidAt
      }
    })

    const user = await this.prisma.user.findFirst({
      where: {
        id: pendingPayments.userId
      }
    })

    console.log({ pendingPayments, user })

    await this.prisma.transaction.create({
      data: {
        date: paidAt,
        name: pendingPayments.name,
        paymentMethod: pendingPayments.paymentMethod,
        totalAmount: pendingPayments.totalAmount,
        type: TransactionType.EXPENSE,
        categoryId: pendingPayments.categoryId,
        description: pendingPayments.description,
        userId: pendingPayments.userId
      }
    })

    return { message: 'Payment made successfully' }
  }
}
