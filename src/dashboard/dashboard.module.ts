import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { GetDashboardUseCase } from './use-case/get-dashboard.use-case'
import { DashboardController } from './infra/http/controllers/dashboard.controller'
import { RecurringBillsModule } from '../recurring-bills/recurring-bills.module'

@Module({
  imports: [PrismaModule, RecurringBillsModule],
  controllers: [DashboardController],
  providers: [GetDashboardUseCase]
})
export class DashboardModule {}
