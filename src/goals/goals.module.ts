import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaGoalRepository } from './infra/database/prisma/prisma-goal.repository'
import { GoalsController } from './infra/http/controllers/goals.controller'
import { GoalRepository } from './repositories/goal.repository'
import { CreateGoalUseCase } from './use-case/create-goal.use-case'
import { DeleteGoalUseCase } from './use-case/delete-goal.use-case'
import { GetGoalsUseCase } from './use-case/get-goals.use-case'
import { UpdateGoalUseCase } from './use-case/update-goal.use-case'
import { UpdateProgressUseCase } from './use-case/update-progress.use-case'

@Module({
  imports: [AuthModule],
  controllers: [GoalsController],
  providers: [
    PrismaService,
    CreateGoalUseCase,
    GetGoalsUseCase,
    UpdateGoalUseCase,
    UpdateProgressUseCase,
    DeleteGoalUseCase,
    {
      provide: GoalRepository,
      useClass: PrismaGoalRepository
    }
  ],
  exports: [GoalRepository]
})
export class GoalsModule {}
