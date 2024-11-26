import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaInstallmentRepository } from './infra/database/prisma/prisma-installment.repository'
import { PrismaTransactionRepository } from './infra/database/prisma/prisma-transaction.repository'
import { TransactionsController } from './infra/http/controllers/transactions.controller'
import { InstallmentRepository } from './repositories/installment.repository'
import { TransactionRepository } from './repositories/transaction.repository'
import { CreateTransactionsUseCase } from './use-case/create-transactions.use-case'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'

@Module({
  controllers: [TransactionsController],
  providers: [
    PrismaService,
    GetTransactionsUseCase,
    CreateTransactionsUseCase,
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
