import { SubscriptionPlan } from '@prisma/client'

export abstract class SubscriptionPlanRepository {
  abstract findAll(filters?: {
    isActive?: boolean
  }): Promise<SubscriptionPlan[]>
  abstract findById(id: string): Promise<SubscriptionPlan | null>
  abstract updateUserPlan(userId: string, planId: string): Promise<void>
}
