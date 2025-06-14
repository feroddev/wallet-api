import { Injectable } from '@nestjs/common'
import { BudgetRepository } from '../repositories/budget.repository'

interface DeleteBudgetRequest {
  id: string
  userId: string
}

@Injectable()
export class DeleteBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(request: DeleteBudgetRequest) {
    const { id, userId } = request

    const budget = await this.budgetRepository.findById(id)

    if (!budget) {
      throw new Error('Orçamento não encontrado')
    }

    if (budget.userId !== userId) {
      throw new Error('Você não tem permissão para excluir este orçamento')
    }

    await this.budgetRepository.delete(id)
  }
}
