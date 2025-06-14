import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category.repository'

@Injectable()
export class GetAllCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute() {
    return this.categoryRepository.findAll()
  }
}
