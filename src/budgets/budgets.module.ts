import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaBudgetRepository } from './infra/database/prisma/prisma-budget.repository'
import { BudgetsController } from './infra/http/controllers/budgets.controller'
import { BudgetRepository } from './repositories/budget.repository'
import { CreateBudgetUseCase } from './use-case/create-budget.use-case'
import { DeleteBudgetUseCase } from './use-case/delete-budget.use-case'
import { GetBudgetsUseCase } from './use-case/get-budgets.use-case'
import { UpdateBudgetUseCase } from './use-case/update-budget.use-case'

@Module({
  imports: [AuthModule],
  controllers: [BudgetsController],
  providers: [
    CreateBudgetUseCase,
    GetBudgetsUseCase,
    UpdateBudgetUseCase,
    DeleteBudgetUseCase,
    {
      provide: BudgetRepository,
      useClass: PrismaBudgetRepository
    }
  ],
  exports: [BudgetRepository]
})
export class BudgetsModule {}
