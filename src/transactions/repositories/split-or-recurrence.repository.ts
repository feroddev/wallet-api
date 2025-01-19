import { Prisma } from '@prisma/client'
import { GetInvoicesDto } from '../../credit-card/infra/http/dto/get-invoice.dto'
import { SplitOrRecurrenceDto } from '../infra/http/dto/create-split-or-recurrence.dto'

export abstract class SplitOrRecurrenceRepository {
  abstract createWithTransaction(
    data: SplitOrRecurrenceDto[],
    transaction: Prisma.TransactionClient
  ): Promise<any>

  abstract findMany(
    userId: string,
    creditCardId: string,
    query: GetInvoicesDto
  ): Promise<any>

  abstract pay(id: string, paidAt: Date): Promise<any>

  abstract payByCreditCard(creditCardId: string, paidAt: Date): Promise<any>

  abstract findBills(userId: string, query: GetInvoicesDto): Promise<any>
}
