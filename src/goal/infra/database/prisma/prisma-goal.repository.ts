import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { GoalRepository } from '../../../repositories/goal.repository'
import { CreateGoalDto } from '../../http/dto/create-goal.dto'
import { UpdateGoalDto } from '../../http/dto/update-goal.dto'

@Injectable()
export class PrismaGoalRepository implements GoalRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        targetValue: data.targetValue,
        deadline: data.deadline
      }
    })
  }

  async findAll(userId: string) {
    return this.prisma.goal.findMany({
      where: {
        userId
      },
      orderBy: {
        deadline: 'asc'
      }
    })
  }

  async findById(id: string, userId: string) {
    return this.prisma.goal.findFirst({
      where: {
        id,
        userId
      }
    })
  }

  async update(id: string, userId: string, data: UpdateGoalDto) {
    return this.prisma.goal.update({
      where: {
        id,
        userId
      },
      data
    })
  }

  async delete(id: string, userId: string) {
    return this.prisma.goal.delete({
      where: {
        id,
        userId
      }
    })
  }
}
