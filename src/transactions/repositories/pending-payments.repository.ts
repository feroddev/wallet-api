import { Prisma } from '@prisma/client'
import { CreditCardExpenseDto } from '../infra/http/dto/create-credit-card-expense.dto'

export abstract class PendingPaymentsRepository {
  abstract createWithTransaction(
    data: CreditCardExpenseDto[],
    transaction: Prisma.TransactionClient
  ): Promise<any>
}
