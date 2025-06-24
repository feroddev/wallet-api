import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'
import { Decimal } from '@prisma/client/runtime/library'

interface CreateBudgetRequest {
  userId: string
  categoryId: string
  limit: number
}

@Injectable()
export class CreateBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(request: CreateBudgetRequest) {
    const { userId, categoryId, limit } = request

    return this.budgetRepository.create({
      userId,
      categoryId,
      limit: new Decimal(limit)
    })
  }
}
