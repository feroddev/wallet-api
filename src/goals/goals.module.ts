import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaGoalRepository } from './infra/database/prisma/prisma-goal.repository'
import { GoalsController } from './infra/http/controllers/goals.controller'
import { GoalRepository } from './repositories/goal.repository'
import { CreateGoalUseCase } from './use-case/create-goal.use-case'
import { DeleteGoalUseCase } from './use-case/delete-goal.use-case'
import { GetGoalsUseCase } from './use-case/get-goals.use-case'
import { UpdateGoalUseCase } from './use-case/update-goal.use-case'
import { UpdateProgressUseCase } from './use-case/update-progress.use-case'
import { TransactionRepository } from '../transactions/repositories/transaction.repository'
import { PrismaTransactionRepository } from '../transactions/infra/database/prisma/prisma-transaction.repository'
import { CategoryRepository } from '../transactions/repositories/category.repository'
import { PrismaCategoryRepository } from '../transactions/infra/database/prisma/prisma-category.repository'

@Module({
  imports: [AuthModule],
  controllers: [GoalsController],
  providers: [
    CreateGoalUseCase,
    GetGoalsUseCase,
    UpdateGoalUseCase,
    UpdateProgressUseCase,
    DeleteGoalUseCase,
    {
      provide: GoalRepository,
      useClass: PrismaGoalRepository
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
  exports: [GoalRepository]
})
export class GoalsModule {}
