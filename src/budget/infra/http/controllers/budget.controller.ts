import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateBudgetUseCase } from '../../../use-case/create-budget.use-case'
import { DeleteBudgetUseCase } from '../../../use-case/delete-budget.use-case'
import { FindBudgetUseCase } from '../../../use-case/find-budget.use-case'
import { GetBudgetsUseCase } from '../../../use-case/get-budgets.use-case'
import { UpdateBudgetUseCase } from '../../../use-case/update-budget.use-case'
import { CreateBudgetDto } from '../dto/create-budget.dto'
import { GetBudgetsDto } from '../dto/get-budgets.dto'
import { UpdateBudgetDto } from '../dto/update-budget.dto'

@Auth()
@ApiTags('Orçamentos')
@Controller('/budgets')
export class BudgetController {
  constructor(
    private readonly createBudgetUseCase: CreateBudgetUseCase,
    private readonly getBudgetsUseCase: GetBudgetsUseCase,
    private readonly findBudgetUseCase: FindBudgetUseCase,
    private readonly updateBudgetUseCase: UpdateBudgetUseCase,
    private readonly deleteBudgetUseCase: DeleteBudgetUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um orçamento por categoria/mês' })
  @ApiBody({ type: CreateBudgetDto })
  @ApiResponse({ status: 201, description: 'Orçamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Jwt() { userId }: JwtPayload,
    @Body() data: CreateBudgetDto
  ) {
    return this.createBudgetUseCase.execute(userId, data)
  }

  @Get()
  @ApiOperation({ summary: 'Listar orçamentos do período' })
  @ApiQuery({ name: 'month', required: false, type: Number, description: 'Mês (1-12)' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Ano' })
  @ApiResponse({ status: 200, description: 'Lista de orçamentos' })
  async getAll(
    @Jwt() { userId }: JwtPayload,
    @Query() filters: GetBudgetsDto
  ) {
    return this.getBudgetsUseCase.execute(userId, filters)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar limite de orçamento' })
  @ApiParam({ name: 'id', description: 'ID do orçamento' })
  @ApiBody({ type: UpdateBudgetDto })
  @ApiResponse({ status: 200, description: 'Orçamento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Orçamento não encontrado' })
  async update(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() data: UpdateBudgetDto
  ) {
    return this.updateBudgetUseCase.execute(id, userId, data)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remover orçamento' })
  @ApiParam({ name: 'id', description: 'ID do orçamento' })
  @ApiResponse({ status: 200, description: 'Orçamento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Orçamento não encontrado' })
  async delete(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ) {
    return this.deleteBudgetUseCase.execute(id, userId)
  }
}
