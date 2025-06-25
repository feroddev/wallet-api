import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaModule } from '../prisma/prisma.module'
import { RecurringBillsCron } from './cron/recurring-bills.cron'
import { RecurringBillsService } from './services/recurring-bills.service'
import { RecurringBillsController } from './controllers/recurring-bills.controller'
import {
  CreateRecurringBillUseCase,
  DeleteRecurringBillUseCase,
  GetRecurringBillUseCase,
  GetRecurringBillsUseCase,
  UpdateRecurringBillUseCase
} from './use-case'
import { RecurringBillRepository } from './repositories/recurring-bill.repository'
import { PrismaRecurringBillRepository } from './repositories/prisma/prisma-recurring-bill.repository'
import { TransactionRepository } from '../transactions/repositories/transaction.repository'
import { PrismaTransactionRepository } from '../transactions/infra/database/prisma/prisma-transaction.repository'
import { CategoryRepository } from '../transactions/repositories/category.repository'
import { PrismaCategoryRepository } from '../transactions/infra/database/prisma/prisma-category.repository'

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [RecurringBillsController],
  providers: [
    RecurringBillsCron,
    RecurringBillsService,
    CreateRecurringBillUseCase,
    GetRecurringBillsUseCase,
    GetRecurringBillUseCase,
    UpdateRecurringBillUseCase,
    DeleteRecurringBillUseCase,
    {
      provide: RecurringBillRepository,
      useClass: PrismaRecurringBillRepository
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository
    }
  ],
  exports: [RecurringBillsService]
})
export class RecurringBillsModule {}
