import { Goal } from '@prisma/client'
import { CreateGoalDto } from '../infra/http/dto/create-goal.dto'

export abstract class GoalRepository {
  abstract create(data: CreateGoalDto & { userId: string }): Promise<Goal>

  abstract findById(id: string): Promise<Goal | null>

  abstract findByUserId(userId: string): Promise<Goal[]>

  abstract update(id: string, data: Partial<Goal>): Promise<Goal>

  abstract delete(id: string): Promise<void>

  abstract updateProgress(id: string, amount: number): Promise<Goal>
}
