import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateBudgetUseCase } from '../../../use-case/create-budget.use-case'
import { DeleteBudgetUseCase } from '../../../use-case/delete-budget.use-case'
import { GetBudgetsUseCase } from '../../../use-case/get-budgets.use-case'
import { UpdateBudgetUseCase } from '../../../use-case/update-budget.use-case'
import { CreateBudgetDto } from '../dto/create-budget.dto'
import { GetBudgetsDto } from '../dto/get-budgets.dto'
import { UpdateBudgetDto } from '../dto/update-budget.dto'

@Auth()
@ApiTags('Orçamentos')
@Controller('budgets')
export class BudgetsController {
  constructor(
    private createBudgetUseCase: CreateBudgetUseCase,
    private getBudgetsUseCase: GetBudgetsUseCase,
    private updateBudgetUseCase: UpdateBudgetUseCase,
    private deleteBudgetUseCase: DeleteBudgetUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um orçamento por categoria/mês' })
  @ApiBody({ type: CreateBudgetDto })
  @ApiResponse({ status: 201, description: 'Orçamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() body: CreateBudgetDto, @Jwt() { userId }: JwtPayload) {
    const { categoryId, limit } = body

    const budget = await this.createBudgetUseCase.execute({
      userId,
      categoryId,
      limit
    })

    return budget
  }

  @Get()
  async getBudgets(
    @Query() query: GetBudgetsDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { month, year, categoryId } = query

    const budgets = await this.getBudgetsUseCase.execute({
      userId,
      month,
      year,
      categoryId
    })

    return budgets.map((budget) => ({
      ...budget,
      available: Number(budget.limit) - budget.spent,
      percentUsed: Math.min(100, (budget.spent / Number(budget.limit)) * 100)
    }))
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar limite de orçamento' })
  @ApiParam({ name: 'id', description: 'ID do orçamento' })
  @ApiBody({ type: UpdateBudgetDto })
  @ApiResponse({ status: 200, description: 'Orçamento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Orçamento não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBudgetDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { categoryId, limit } = body

    const budget = await this.updateBudgetUseCase.execute({
      id,
      userId,
      categoryId,
      limit
    })

    return budget
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover orçamento' })
  @ApiParam({ name: 'id', description: 'ID do orçamento' })
  @ApiResponse({ status: 200, description: 'Orçamento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Orçamento não encontrado' })
  async delete(@Param('id') id: string, @Jwt() { userId }: JwtPayload) {
    await this.deleteBudgetUseCase.execute({
      id,
      userId
    })

    return {
      message: 'Orçamento removido com sucesso'
    }
  }
}
