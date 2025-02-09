import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaCreditCardRepository } from '../credit-card/infra/database/prisma/prisma-credit-card.repository'
import { CreditCardRepository } from '../credit-card/repositories/credit-card.repository'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaCategoryRepository } from './infra/database/prisma/prisma-category.repository'
import { PrismaCreditCardExpenseRepository } from './infra/database/prisma/prisma-credit-card-expense.repository'
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
import { CreateTransactionsUseCase } from './use-case/create-transactions.use-case'
import { FindTransactionUseCase } from './use-case/find-transaction.use-case'
import { GetBillsUseCase } from './use-case/get-bills.use-case'
import { GetCategoriesUseCase } from './use-case/get-categories.use-case'
import { GetInvoicesUseCase } from './use-case/get-invoices.use-case'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'
import { PaidPendingPaymentUseCase } from './use-case/paid-pending-payment.use-case'
import { PayCreditCardUseCase } from './use-case/pay-credit-card.use-case'

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
    PaidPendingPaymentUseCase,
    PayCreditCardUseCase,
    GetInvoicesUseCase,
    GetBillsUseCase,
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
