import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { InstallmentsController } from '../transactions/infra/http/controllers/installments.controller'
import { PrismaInstallmentRepository } from './infra/database/prisma/prisma-installment.repository'
import { PrismaTransactionRepository } from './infra/database/prisma/prisma-transaction.repository'
import { TransactionsController } from './infra/http/controllers/transactions.controller'
import { InstallmentRepository } from './repositories/installment.repository'
import { TransactionRepository } from './repositories/transaction.repository'
import { CreateTransactionsUseCase } from './use-case/create-transactions.use-case'
import { GetInstallmentsUseCase } from './use-case/get-installments.use-case'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'

@Module({
  controllers: [TransactionsController, InstallmentsController],
  providers: [
    PrismaService,
    GetTransactionsUseCase,
    CreateTransactionsUseCase,
    GetInstallmentsUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    },
    {
      provide: InstallmentRepository,
      useClass: PrismaInstallmentRepository
    }
  ],
  imports: [AuthModule]
})
export class TransactionsModule {}
