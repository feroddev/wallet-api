import { Prisma } from '@prisma/client'
import { GetInvoicesDto } from '../../credit-card/infra/http/dto/get-invoice.dto'
import { CreditCardExpenseDto } from '../infra/http/dto/create-credit-card-expense.dto'

export abstract class CreditCardExpenseRepository {
  abstract createWithTransaction(
    data: CreditCardExpenseDto[],
    transaction: Prisma.TransactionClient
  ): Promise<any>

  abstract findMany(
    userId: string,
    creditCardId: string,
    query: GetInvoicesDto
  ): Promise<any>

  abstract payByCreditCard(payload: {
    creditCardId: string
    paidAt: Date
    dueDate: Date
  }): Promise<any>
}
