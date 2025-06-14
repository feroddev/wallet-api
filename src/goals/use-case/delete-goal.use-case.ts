import { Injectable } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'

interface DeleteGoalRequest {
  id: string
  userId: string
}

@Injectable()
export class DeleteGoalUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(request: DeleteGoalRequest) {
    const { id, userId } = request

    const goal = await this.goalRepository.findById(id)

    if (!goal) {
      throw new Error('Meta não encontrada')
    }

    if (goal.userId !== userId) {
      throw new Error('Você não tem permissão para excluir esta meta')
    }

    await this.goalRepository.delete(id)
  }
}
