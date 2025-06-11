import { Injectable, NotFoundException } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'

@Injectable()
export class FindGoalUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(id: string, userId: string) {
    const goal = await this.goalRepository.findById(id, userId)

    if (!goal) {
      throw new NotFoundException('Meta não encontrada')
    }

    return goal
  }
}
