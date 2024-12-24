import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaCreditCardRepository } from '../credit-card/infra/database/prisma/prisma-credit-card.repository'
import { CreditCardRepository } from '../credit-card/repositories/credit-card.repository'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaCategoryRepository } from './infra/database/prisma/prisma-category.repository'
import { PrismaSplitOrRecurrenceRepository } from './infra/database/prisma/prisma-split-or-recurrence.repository'
import { PrismaTransactionRepository } from './infra/database/prisma/prisma-transaction.repository'
import { CategoriesController } from './infra/http/controllers/categories.controller'
import { TransactionsController } from './infra/http/controllers/transactions.controller'
import { CategoryRepository } from './repositories/category.repository'
import { SplitOrRecurrenceRepository } from './repositories/split-or-recurrence.repository'
import { TransactionRepository } from './repositories/transaction.repository'
import { CreateTransactionsUseCase } from './use-case/create-transactions.use-case'
import { FindTransactionUseCase } from './use-case/find-transaction.use-case'
import { GetCategoriesUseCase } from './use-case/get-categories.use-case'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'

@Module({
  controllers: [TransactionsController, CategoriesController],
  providers: [
    PrismaService,
    CreateTransactionsUseCase,
    GetCategoriesUseCase,
    GetTransactionsUseCase,
    FindTransactionUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository
    },
    {
      provide: SplitOrRecurrenceRepository,
      useClass: PrismaSplitOrRecurrenceRepository
    },
    {
      provide: CreditCardRepository,
      useClass: PrismaCreditCardRepository
    }
  ],
  imports: [AuthModule]
})
export class TransactionsModule {}
