import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaModule } from '../prisma/prisma.module'
import { RecurringBillsCron } from './cron/recurring-bills.cron'
import { RecurringBillsService } from './services/recurring-bills.service'

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [RecurringBillsCron, RecurringBillsService],
  exports: [RecurringBillsService]
})
export class RecurringBillsModule {}
