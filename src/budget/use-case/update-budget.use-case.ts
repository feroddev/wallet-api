import { Injectable, NotFoundException } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'
import { UpdateBudgetDto } from '../infra/http/dto/update-budget.dto'

@Injectable()
export class UpdateBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(id: string, userId: string, data: UpdateBudgetDto) {
    const budget = await this.budgetRepository.findById(id, userId)

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado')
    }

    return this.budgetRepository.update(id, userId, data)
  }
}
