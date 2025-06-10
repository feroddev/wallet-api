import { Injectable } from '@nestjs/common'
import { SubscriptionPlan } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { SubscriptionPlanRepository } from '../../../repositories/subscription-plan.repository'

@Injectable()
export class PrismaSubscriptionPlanRepository implements SubscriptionPlanRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    isActive?: boolean
  }): Promise<SubscriptionPlan[]> {
    const where: any = {}

    if (filters && filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    return this.prisma.subscriptionPlan.findMany({
      where,
      orderBy: {
        price: 'asc'
      }
    })
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    return this.prisma.subscriptionPlan.findUnique({
      where: { id }
    })
  }

  async updateUserPlan(userId: string, planId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        SubscriptionPlan: {
          connect: { id: planId }
        }
      }
    })
  }
}
