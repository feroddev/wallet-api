import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { TransactionRepository } from '../transactions/repositories/transaction.repository'
import { TransactionsModule } from '../transactions/transactions.module'
import { PrismaBillToPayRepository } from './infra/database/prisma/prisma-bill-to-pay.repository'
import { BillsController } from './infra/http/controllers/bills.controller'
import { BillToPayRepository } from './repositories/bill-to-pay.repository'
import { CreateBillUseCase } from './use-case/create-bill.use-case'
import { DeleteBillUseCase } from './use-case/delete-bill.use-case'
import { GetBillsUseCase } from './use-case/get-bills.use-case'
import { PayBillUseCase } from './use-case/pay-bill.use-case'
import { UpdateBillUseCase } from './use-case/update-bill.use-case'
import { PrismaTransactionRepository } from '../transactions/infra/database/prisma/prisma-transaction.repository'

@Module({
  imports: [AuthModule, TransactionsModule],
  controllers: [BillsController],
  providers: [
    CreateBillUseCase,
    GetBillsUseCase,
    UpdateBillUseCase,
    PayBillUseCase,
    DeleteBillUseCase,
    {
      provide: BillToPayRepository,
      useClass: PrismaBillToPayRepository
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    }
  ],
  exports: [BillToPayRepository]
})
export class BillsModule {}
