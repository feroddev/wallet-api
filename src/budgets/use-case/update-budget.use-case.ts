import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'
import { Decimal } from '@prisma/client/runtime/library'

interface UpdateBudgetRequest {
  id: string
  userId: string
  categoryId?: string
  limit?: number
}

@Injectable()
export class UpdateBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(request: UpdateBudgetRequest) {
    const { id, userId, categoryId, limit } = request

    const budget = await this.budgetRepository.findById(id)

    if (!budget) {
      throw new Error('Orçamento não encontrado')
    }

    if (budget.userId !== userId) {
      throw new Error('Você não tem permissão para atualizar este orçamento')
    }

    return this.budgetRepository.update(id, {
      categoryId,
      limit: new Decimal(limit)
    })
  }
}
