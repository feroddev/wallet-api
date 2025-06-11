import { Injectable } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'

@Injectable()
export class GetGoalsUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(userId: string) {
    return this.goalRepository.findAll(userId)
  }
}
