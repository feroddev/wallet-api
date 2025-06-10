import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaSubscriptionPlanRepository } from './infra/database/prisma/prisma-subscription-plan.repository'
import { SubscriptionPlansController } from './infra/http/controllers/subscription-plans.controller'
import { SubscriptionPlanRepository } from './repositories/subscription-plan.repository'
import { GetPlansUseCase } from './use-case/get-plans.use-case'
import { UpdateUserPlanUseCase } from './use-case/update-user-plan.use-case'

@Module({
  imports: [AuthModule],
  controllers: [SubscriptionPlansController],
  providers: [
    PrismaService,
    GetPlansUseCase,
    UpdateUserPlanUseCase,
    {
      provide: SubscriptionPlanRepository,
      useClass: PrismaSubscriptionPlanRepository
    }
  ],
  exports: [SubscriptionPlanRepository]
})
export class SubscriptionPlansModule {}
