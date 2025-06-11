import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { BudgetController } from './infra/http/controllers/budget.controller'
import { PrismaBudgetRepository } from './infra/database/prisma/prisma-budget.repository'
import { BudgetRepository } from './repositories/budget.repository'
import { CreateBudgetUseCase } from './use-case/create-budget.use-case'
import { DeleteBudgetUseCase } from './use-case/delete-budget.use-case'
import { FindBudgetUseCase } from './use-case/find-budget.use-case'
import { GetBudgetsUseCase } from './use-case/get-budgets.use-case'
import { UpdateBudgetUseCase } from './use-case/update-budget.use-case'

@Module({
  imports: [PrismaModule],
  controllers: [BudgetController],
  providers: [
    {
      provide: BudgetRepository,
      useClass: PrismaBudgetRepository
    },
    CreateBudgetUseCase,
    GetBudgetsUseCase,
    FindBudgetUseCase,
    UpdateBudgetUseCase,
    DeleteBudgetUseCase
  ],
  exports: [BudgetRepository]
})
export class BudgetModule {}
