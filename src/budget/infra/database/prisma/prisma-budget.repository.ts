import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { BudgetRepository } from '../../../repositories/budget.repository'
import { CreateBudgetDto } from '../../http/dto/create-budget.dto'
import { GetBudgetsDto } from '../../http/dto/get-budgets.dto'
import { UpdateBudgetDto } from '../../http/dto/update-budget.dto'

@Injectable()
export class PrismaBudgetRepository implements BudgetRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        userId,
        category: data.category,
        limit: data.limit,
        month: data.month,
        year: data.year
      }
    })
  }

  async findAll(userId: string, filters: GetBudgetsDto) {
    const { month, year } = filters

    const where = {
      userId,
      ...(month && { month }),
      ...(year && { year })
    }

    return this.prisma.budget.findMany({
      where,
      orderBy: [
        { year: 'asc' },
        { month: 'asc' },
        { category: 'asc' }
      ]
    })
  }

  async findById(id: string, userId: string) {
    return this.prisma.budget.findFirst({
      where: {
        id,
        userId
      }
    })
  }

  async update(id: string, userId: string, data: UpdateBudgetDto) {
    return this.prisma.budget.update({
      where: {
        id,
        userId
      },
      data
    })
  }

  async delete(id: string, userId: string) {
    return this.prisma.budget.delete({
      where: {
        id,
        userId
      }
    })
  }
}
