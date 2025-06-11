import { Injectable } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'
import { CreateGoalDto } from '../infra/http/dto/create-goal.dto'

@Injectable()
export class CreateGoalUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(userId: string, data: CreateGoalDto) {
    return this.goalRepository.create(userId, data)
  }
}
