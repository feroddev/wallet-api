import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { GoalController } from './infra/http/controllers/goal.controller'
import { PrismaGoalRepository } from './infra/database/prisma/prisma-goal.repository'
import { GoalRepository } from './repositories/goal.repository'
import { CreateGoalUseCase } from './use-case/create-goal.use-case'
import { DeleteGoalUseCase } from './use-case/delete-goal.use-case'
import { FindGoalUseCase } from './use-case/find-goal.use-case'
import { GetGoalsUseCase } from './use-case/get-goals.use-case'
import { UpdateGoalUseCase } from './use-case/update-goal.use-case'

@Module({
  imports: [],
  controllers: [GoalController],
  providers: [
    {
      provide: GoalRepository,
      useClass: PrismaGoalRepository
    },
    CreateGoalUseCase,
    GetGoalsUseCase,
    FindGoalUseCase,
    UpdateGoalUseCase,
    DeleteGoalUseCase
  ],
  exports: [GoalRepository]
})
export class GoalModule {}
