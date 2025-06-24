import { Budget } from '@prisma/client'

export abstract class BudgetRepository {
  abstract create(data: Partial<Budget>): Promise<Budget>

  abstract findById(id: string): Promise<Budget | null>

  abstract findByUserId(
    userId: string,
    filters?: {
      month?: number
      year?: number
      categoryId?: string
    }
  ): Promise<Budget[]>

  abstract findByUserIdWithSpent(
    userId: string,
    filters?: {
      month?: number
      year?: number
      categoryId?: string
    }
  ): Promise<(Budget & { spent: number })[]>

  abstract update(id: string, data: Partial<Budget>): Promise<Budget>

  abstract delete(id: string): Promise<void>
}
