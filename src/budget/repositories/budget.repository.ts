import { CreateBudgetDto } from '../infra/http/dto/create-budget.dto'
import { GetBudgetsDto } from '../infra/http/dto/get-budgets.dto'
import { UpdateBudgetDto } from '../infra/http/dto/update-budget.dto'

export abstract class BudgetRepository {
  abstract create(userId: string, data: CreateBudgetDto): Promise<any>

  abstract findAll(userId: string, filters: GetBudgetsDto): Promise<any>

  abstract findById(id: string, userId: string): Promise<any>

  abstract update(
    id: string,
    userId: string,
    data: UpdateBudgetDto
  ): Promise<any>

  abstract delete(id: string, userId: string): Promise<any>
}
