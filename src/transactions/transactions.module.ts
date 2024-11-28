import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { InstallmentsController } from '../transactions/infra/http/controllers/installments.controller'
import { PrismaCategoryRepository } from './infra/database/prisma/prisma-category.repository'
import { PrismaInstallmentRepository } from './infra/database/prisma/prisma-installment.repository'
import { PrismaTransactionRepository } from './infra/database/prisma/prisma-transaction.repository'
import { CategoriesController } from './infra/http/controllers/categories.controller'
import { TransactionsController } from './infra/http/controllers/transactions.controller'
import { CategoryRepository } from './repositories/category.repository'
import { InstallmentRepository } from './repositories/installment.repository'
import { TransactionRepository } from './repositories/transaction.repository'
import { CreateTransactionsUseCase } from './use-case/create-transactions.use-case'
import { GetCategoriesUseCase } from './use-case/get-categories.use-case'
import { GetInstallmentsUseCase } from './use-case/get-installments.use-case'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'
import { PayInstallmentUseCase } from './use-case/pay-installment.use-case'

@Module({
  controllers: [
    TransactionsController,
    CategoriesController,
    InstallmentsController
  ],
  providers: [
    PrismaService,
    GetTransactionsUseCase,
    CreateTransactionsUseCase,
    GetInstallmentsUseCase,
    GetCategoriesUseCase,
    PayInstallmentUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    },
    {
      provide: InstallmentRepository,
      useClass: PrismaInstallmentRepository
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository
    }
  ],
  imports: [AuthModule]
})
export class TransactionsModule {}
