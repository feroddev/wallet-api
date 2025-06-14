import { Category } from '@prisma/client'

export abstract class CategoryRepository {
  abstract create(data: Category): Promise<Category>

  abstract find(data: Partial<Category>): Promise<Category>

  abstract findMany(data: Partial<Category>): Promise<Category[]>

  abstract findAll(): Promise<Category[]>

  abstract update(id: string, data: Partial<Category>): Promise<Category>

  abstract delete(id: string): Promise<void>
}
