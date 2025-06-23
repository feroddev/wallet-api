import { Injectable, NotFoundException } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'
import { errors } from '../../../constants/errors'

@Injectable()
export class FindBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(id: string, userId: string) {
    const budget = await this.budgetRepository.findById(id, userId)

    if (!budget) {
      throw new NotFoundException(errors.BUDGET_NOT_FOUND)
    }

    return budget
  }
}
