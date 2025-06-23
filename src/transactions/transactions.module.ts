import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaCreditCardRepository } from '../credit-card/infra/database/prisma/prisma-credit-card.repository'
import { CreditCardRepository } from '../credit-card/repositories/credit-card.repository'
import { PrismaCategoryRepository } from './infra/database/prisma/prisma-category.repository'
import { PrismaTransactionRepository } from './infra/database/prisma/prisma-transaction.repository'
import { CategoriesController } from './infra/http/controllers/categories.controller'
import { TransactionsController } from './infra/http/controllers/transactions.controller'
import { CategoryRepository } from './repositories/category.repository'
import { CreateTransactionsUseCase } from './use-case/create-transactions.use-case'
import { DeleteTransactionUseCase } from './use-case/delete-transaction.use-case'
import { DeleteInstallmentsUseCase } from './use-case/delete-installments.use-case'
import { FindTransactionUseCase } from './use-case/find-transaction.use-case'
import { GetAllCategoriesUseCase } from './use-case/get-all-categories.use-case'
import { GetCategoriesUseCase } from './use-case/get-categories.use-case'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'
import { UpdateTransactionUseCase } from './use-case/update-transaction.use-case'
import { PayTransactionUseCase } from './use-case/pay-transaction.use-case'
import { InvoiceRepository } from '../invoices/repositories/invoice.repository'
import { PrismaInvoiceRepository } from '../invoices/infra/database/prisma/prisma-invoice.repository'
import { TransactionRepository } from './repositories/transaction.repository'

@Module({
  controllers: [TransactionsController, CategoriesController],
  providers: [
    CreateTransactionsUseCase,
    GetCategoriesUseCase,
    GetAllCategoriesUseCase,
    GetTransactionsUseCase,
    FindTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    DeleteInstallmentsUseCase,
    PayTransactionUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository
    },
    {
      provide: CreditCardRepository,
      useClass: PrismaCreditCardRepository
    },
    {
      provide: InvoiceRepository,
      useClass: PrismaInvoiceRepository
    }
  ],
  imports: [AuthModule]
})
export class TransactionsModule {}
