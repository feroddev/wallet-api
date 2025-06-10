import { Injectable } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'

interface CreateGoalRequest {
  userId: string
  name: string
  description?: string
  targetValue: number
  savedValue?: number
  deadline: Date
}

@Injectable()
export class CreateGoalUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(request: CreateGoalRequest) {
    const { userId, name, description, targetValue, savedValue, deadline } = request

    return this.goalRepository.create({
      userId,
      name,
      description,
      targetValue: targetValue as any,
      savedValue: (savedValue || 0) as any,
      deadline
    })
  }
}
