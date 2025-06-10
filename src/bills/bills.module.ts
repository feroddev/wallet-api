import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
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

@Module({
  imports: [AuthModule, TransactionsModule],
  controllers: [BillsController],
  providers: [
    PrismaService,
    CreateBillUseCase,
    GetBillsUseCase,
    UpdateBillUseCase,
    PayBillUseCase,
    DeleteBillUseCase,
    {
      provide: BillToPayRepository,
      useClass: PrismaBillToPayRepository
    }
  ],
  exports: [BillToPayRepository]
})
export class BillsModule {}
