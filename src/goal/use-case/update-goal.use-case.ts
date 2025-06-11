import { Injectable, NotFoundException } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'
import { UpdateGoalDto } from '../infra/http/dto/update-goal.dto'

@Injectable()
export class UpdateGoalUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(id: string, userId: string, data: UpdateGoalDto) {
    const goal = await this.goalRepository.findById(id, userId)

    if (!goal) {
      throw new NotFoundException('Meta não encontrada')
    }

    return this.goalRepository.update(id, userId, data)
  }
}
