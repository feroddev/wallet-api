import { Injectable } from '@nestjs/common'
import { SubscriptionPlanRepository } from '../repositories/subscription-plan.repository'

interface GetPlansRequest {
  isActive?: boolean
}

@Injectable()
export class GetPlansUseCase {
  constructor(private subscriptionPlanRepository: SubscriptionPlanRepository) {}

  async execute(request: GetPlansRequest = {}) {
    const { isActive } = request

    return this.subscriptionPlanRepository.findAll({
      isActive
    })
  }
}
