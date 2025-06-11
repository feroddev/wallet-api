import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'
import { CreateBudgetDto } from '../infra/http/dto/create-budget.dto'

@Injectable()
export class CreateBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(userId: string, data: CreateBudgetDto) {
    return this.budgetRepository.create(userId, data)
  }
}
