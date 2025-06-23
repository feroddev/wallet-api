import { Injectable, NotFoundException } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'
import { errors } from '../../../constants/errors'

@Injectable()
export class FindGoalUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(id: string, userId: string) {
    const goal = await this.goalRepository.findById(id, userId)

    if (!goal) {
      throw new NotFoundException(errors.GOAL_NOT_FOUND)
    }

    return goal
  }
}
