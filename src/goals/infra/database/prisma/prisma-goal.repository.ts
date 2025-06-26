import { Injectable } from '@nestjs/common'
import { Goal } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { GoalRepository } from '../../../repositories/goal.repository'
import { CreateGoalDto } from '../../http/dto/create-goal.dto'

@Injectable()
export class PrismaGoalRepository implements GoalRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateGoalDto & { userId: string }): Promise<Goal> {
    return this.prisma.goal.create({
      data
    })
  }

  async findById(id: string): Promise<Goal | null> {
    return this.prisma.goal.findUnique({
      where: { id }
    })
  }

  async findByUserId(userId: string): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: { userId }
    })
  }

  async update(id: string, data: Partial<Goal>): Promise<Goal> {
    return this.prisma.goal.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.goal.delete({
      where: { id }
    })
  }

  async updateProgress(id: string, amount: number): Promise<Goal> {
    const goal = await this.findById(id)

    if (!goal) {
      throw new Error('Meta não encontrada')
    }

    return this.prisma.goal.update({
      where: { id },
      data: {
        savedValue: {
          increment: amount
        }
      }
    })
  }
}
