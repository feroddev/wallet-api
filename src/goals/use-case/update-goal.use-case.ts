import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'

interface UpdateGoalRequest {
  id: string
  userId: string
  name?: string
  description?: string
  targetValue?: number
  deadline?: Date
}

@Injectable()
export class UpdateGoalUseCase {
  constructor(private goalRepository: GoalRepository) {}

  async execute(request: UpdateGoalRequest) {
    const { id, userId, name, description, targetValue, deadline } = request

    const goal = await this.goalRepository.findById(id)

    if (!goal) {
      throw new NotFoundException('Meta não encontrada')
    }

    if (goal.userId !== userId) {
      throw new BadRequestException(
        'Você não tem permissão para atualizar esta meta'
      )
    }

    return this.goalRepository.update(id, {
      name,
      description,
      targetValue: targetValue as any,
      deadline
    })
  }
}
