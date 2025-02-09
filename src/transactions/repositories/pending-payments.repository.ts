import { Prisma } from '@prisma/client'
import { GetBillsDto } from '../../credit-card/infra/http/dto/get-bills.dto'
import { CreatePendingPaymentDto } from '../infra/http/dto/create-pending-payment.dto'

export abstract class PendingPaymentsRepository {
  abstract createWithTransaction(
    data: CreatePendingPaymentDto[],
    transaction: Prisma.TransactionClient
  ): Promise<any>

  abstract findBills(userId: string, query: GetBillsDto): Promise<any>

  abstract payPendingPayment(id: string, paidAt: Date): Promise<any>
}
