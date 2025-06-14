import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { GetAllCategoriesUseCase } from '../../../use-case/get-all-categories.use-case'
import { GetCategoriesUseCase } from '../../../use-case/get-categories.use-case'
import { GetCategoriesDto } from '../dto/get-categories.dto'

@Auth()
@ApiTags('Categorias')
@Controller('/categories')
export class CategoriesController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorias de transações' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Tipo de categoria (EXPENSE, INCOME, INVESTMENT)'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias filtradas por tipo'
  })
  async getCategories(@Query() query: GetCategoriesDto) {
    return this.getCategoriesUseCase.execute(query)
  }

  @Get('/all')
  @ApiOperation({ summary: 'Listar todas as categorias sem filtro' })
  @ApiResponse({ status: 200, description: 'Lista completa de categorias' })
  async getAllCategories() {
    return this.getAllCategoriesUseCase.execute()
  }
}
