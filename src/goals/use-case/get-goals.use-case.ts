import { Injectable } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'

interface GetGoalsRequest {
  userId: string
}

@Injectable()
export class GetGoalsUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(request: GetGoalsRequest) {
    const { userId } = request

    const goals = await this.goalRepository.findByUserId(userId)

    return goals.map((goal) => {
      const progress =
        (Number(goal.savedValue) / Number(goal.targetValue)) * 100

      return {
        ...goal,
        progress: Math.min(progress, 100)
      }
    })
  }
}
