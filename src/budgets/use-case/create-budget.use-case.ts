import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'

interface CreateBudgetRequest {
  userId: string
  category: string
  limit: number
  month: number
  year: number
}

@Injectable()
export class CreateBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(request: CreateBudgetRequest) {
    const { userId, category, limit, month, year } = request

    return this.budgetRepository.create({
      userId,
      category,
      limit: limit as any,
      month,
      year
    })
  }
}
