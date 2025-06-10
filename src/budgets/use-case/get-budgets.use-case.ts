import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'

interface GetBudgetsRequest {
  userId: string
  month?: number
  year?: number
  category?: string
}

@Injectable()
export class GetBudgetsUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(request: GetBudgetsRequest) {
    const { userId, month, year, category } = request

    return this.budgetRepository.findByUserIdWithSpent(userId, {
      month,
      year,
      category
    })
  }
}
