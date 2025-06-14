import { CreateGoalDto } from '../infra/http/dto/create-goal.dto'
import { UpdateGoalDto } from '../infra/http/dto/update-goal.dto'

export abstract class GoalRepository {
  abstract create(userId: string, data: CreateGoalDto): Promise<any>

  abstract findAll(userId: string): Promise<any>

  abstract findById(id: string, userId: string): Promise<any>

  abstract update(id: string, userId: string, data: UpdateGoalDto): Promise<any>

  abstract delete(id: string, userId: string): Promise<any>
}
