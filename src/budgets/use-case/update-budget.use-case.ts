import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'

interface UpdateBudgetRequest {
  id: string
  userId: string
  category?: string
  limit?: number
  month?: number
  year?: number
}

@Injectable()
export class UpdateBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(request: UpdateBudgetRequest) {
    const { id, userId, category, limit, month, year } = request

    const budget = await this.budgetRepository.findById(id)

    if (!budget) {
      throw new Error('Orçamento não encontrado')
    }

    if (budget.userId !== userId) {
      throw new Error('Você não tem permissão para atualizar este orçamento')
    }

    return this.budgetRepository.update(id, {
      category,
      limit: limit as any,
      month,
      year
    })
  }
}
