import { Injectable } from '@nestjs/common'
import { SubscriptionPlanRepository } from '../repositories/subscription-plan.repository'

interface UpdateUserPlanRequest {
  userId: string
  planId: string
}

@Injectable()
export class UpdateUserPlanUseCase {
  constructor(private subscriptionPlanRepository: SubscriptionPlanRepository) {}

  async execute(request: UpdateUserPlanRequest) {
    const { userId, planId } = request

    const plan = await this.subscriptionPlanRepository.findById(planId)
    
    if (!plan) {
      throw new Error('Plano não encontrado')
    }
    
    if (!plan.isActive) {
      throw new Error('Este plano não está disponível')
    }

    await this.subscriptionPlanRepository.updateUserPlan(userId, planId)
  }
}
