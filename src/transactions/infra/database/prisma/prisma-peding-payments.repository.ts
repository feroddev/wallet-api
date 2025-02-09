import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CreatePendingPaymentDto } from '../../http/dto/create-pending-payment.dto'

@Injectable()
export class PrismaPendingPaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithTransaction(
    data: CreatePendingPaymentDto[],
    transaction: Prisma.TransactionClient
  ) {
    return transaction.pendingPayment.createMany({
      data
    })
  }
}
