import { Injectable, NotFoundException } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'

@Injectable()
export class DeleteBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(id: string, userId: string) {
    const budget = await this.budgetRepository.findById(id, userId)

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado')
    }

    return this.budgetRepository.delete(id, userId)
  }
}
