import { Injectable } from '@nestjs/common'
import { GetCategoriesDto } from '../infra/http/dto/get-categories.dto'
import { CategoryRepository } from '../repositories/category.repository'

@Injectable()
export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(query: GetCategoriesDto) {
    const { type } = query
    return this.categoryRepository.findMany({ type })
  }
}
