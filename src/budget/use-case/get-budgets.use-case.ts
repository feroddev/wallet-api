import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'
import { GetBudgetsDto } from '../infra/http/dto/get-budgets.dto'

@Injectable()
export class GetBudgetsUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(userId: string, filters: GetBudgetsDto) {
    return this.budgetRepository.findAll(userId, filters)
  }
}
