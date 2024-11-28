import { Controller, Get, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { GetCategoriesUseCase } from '../../../use-case/get-categories.use-case'
import { GetCategoriesDto } from '../dto/get-categories.dto'

@Auth()
@Controller('/categories')
export class CategoriesController {
  constructor(private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

  @Get()
  async getCategories(@Query() query: GetCategoriesDto) {
    return this.getCategoriesUseCase.execute(query)
  }
}
