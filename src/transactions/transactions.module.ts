import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaCreditCardRepository } from '../credit-card/infra/database/prisma/prisma-credit-card.repository'
import { CreditCardRepository } from '../credit-card/repositories/credit-card.repository'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaCategoryRepository } from './infra/database/prisma/prisma-category.repository'
import { PrismaCreditCardExpenseRepository } from './infra/database/prisma/prisma-credit-card-expense.repository'
import { RecurringTransactionsCron } from './infra/cron/recurring-transactions.cron'
import { PrismaPendingPaymentsRepository } from './infra/database/prisma/prisma-peding-payments.repository'
import { PrismaTransactionRepository } from './infra/database/prisma/prisma-transaction.repository'
import { CategoriesController } from './infra/http/controllers/categories.controller'
import { CreditCardExpenseController } from './infra/http/controllers/credit-card-expense.controller'
import { PendingPaymentController } from './infra/http/controllers/pending-payment.controller'
import { TransactionsController } from './infra/http/controllers/transactions.controller'
import { CategoryRepository } from './repositories/category.repository'
import { CreditCardExpenseRepository } from './repositories/credit-card-expense.repository'
import { PendingPaymentsRepository } from './repositories/pending-payments.repository'
import { TransactionRepository } from './repositories/transaction.repository'
import { CreateRecurringTransactionsUseCase } from './use-case/create-recurring-transactions.use-case'
import { CreateTransactionsUseCase } from './use-case/create-transactions.use-case'
import { DeleteTransactionUseCase } from './use-case/delete-transaction.use-case'
import { FindTransactionUseCase } from './use-case/find-transaction.use-case'
import { GetBillsUseCase } from './use-case/get-bills.use-case'
import { GetCategoriesUseCase } from './use-case/get-categories.use-case'
import { GetInvoicesUseCase } from './use-case/get-invoices.use-case'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'
import { PayCreditCardUseCase } from './use-case/pay-credit-card.use-case'
import { UpdateTransactionUseCase } from './use-case/update-transaction.use-case'
import { CreatePendingPaymentUseCase } from './use-case/create-pending-payment.use-case'
import { GetPendingPaymentsUseCase } from './use-case/get-pending-payments.use-case'
import { FindPendingPaymentUseCase } from './use-case/find-pending-payment.use-case'
import { UpdatePendingPaymentUseCase } from './use-case/update-pending-payment.use-case'
import { DeletePendingPaymentUseCase } from './use-case/delete-pending-payment.use-case'
import { PayPendingPaymentUseCase } from './use-case/pay-pending-payment.use-case'

@Module({
  controllers: [
    TransactionsController,
    CategoriesController,
    CreditCardExpenseController,
    PendingPaymentController
  ],
  providers: [
    PrismaService,
    CreateTransactionsUseCase,
    GetCategoriesUseCase,
    GetTransactionsUseCase,
    FindTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    CreateRecurringTransactionsUseCase,
    RecurringTransactionsCron,
    PayCreditCardUseCase,
    GetInvoicesUseCase,
    GetBillsUseCase,
    CreatePendingPaymentUseCase,
    GetPendingPaymentsUseCase,
    FindPendingPaymentUseCase,
    UpdatePendingPaymentUseCase,
    DeletePendingPaymentUseCase,
    PayPendingPaymentUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository
    },
    {
      provide: CreditCardExpenseRepository,
      useClass: PrismaCreditCardExpenseRepository
    },
    {
      provide: CreditCardRepository,
      useClass: PrismaCreditCardRepository
    },
    {
      provide: PendingPaymentsRepository,
      useClass: PrismaPendingPaymentsRepository
    }
  ],
  imports: [AuthModule]
})
export class TransactionsModule {}
