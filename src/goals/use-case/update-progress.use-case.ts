import { Injectable } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'

interface UpdateProgressRequest {
  id: string
  userId: string
  amount: number
}

@Injectable()
export class UpdateProgressUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(request: UpdateProgressRequest) {
    const { id, userId, amount } = request

    const goal = await this.goalRepository.findById(id)
    
    if (!goal) {
      throw new Error('Meta não encontrada')
    }
    
    if (goal.userId !== userId) {
      throw new Error('Você não tem permissão para atualizar esta meta')
    }

    return this.goalRepository.updateProgress(id, amount)
  }
}
