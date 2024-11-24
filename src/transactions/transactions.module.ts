import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaTransactionRepository } from './infra/database/prisma/prisma-transaction.repository'
import { TransactionsController } from './infra/http/controllers/transactions.controller'
import { TransactionRepository } from './repositories/transaction.repository'
import { GetTransactionsUseCase } from './use-case/get-transactions.use-case'

@Module({
  controllers: [TransactionsController],
  providers: [
    PrismaService,
    GetTransactionsUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    }
  ],
  imports: [AuthModule]
})
export class TransactionsModule {}
