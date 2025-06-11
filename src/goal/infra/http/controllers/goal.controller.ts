import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateGoalUseCase } from '../../../use-case/create-goal.use-case'
import { DeleteGoalUseCase } from '../../../use-case/delete-goal.use-case'
import { FindGoalUseCase } from '../../../use-case/find-goal.use-case'
import { GetGoalsUseCase } from '../../../use-case/get-goals.use-case'
import { UpdateGoalUseCase } from '../../../use-case/update-goal.use-case'
import { CreateGoalDto } from '../dto/create-goal.dto'
import { UpdateGoalDto } from '../dto/update-goal.dto'

@Auth()
@ApiTags('Metas')
@Controller('/goals')
export class GoalController {
  constructor(
    private readonly createGoalUseCase: CreateGoalUseCase,
    private readonly getGoalsUseCase: GetGoalsUseCase,
    private readonly findGoalUseCase: FindGoalUseCase,
    private readonly updateGoalUseCase: UpdateGoalUseCase,
    private readonly deleteGoalUseCase: DeleteGoalUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma meta financeira' })
  @ApiBody({ type: CreateGoalDto })
  @ApiResponse({ status: 201, description: 'Meta criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Jwt() { userId }: JwtPayload,
    @Body() data: CreateGoalDto
  ) {
    return this.createGoalUseCase.execute(userId, data)
  }

  @Get()
  @ApiOperation({ summary: 'Listar metas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de metas' })
  async getAll(@Jwt() { userId }: JwtPayload) {
    return this.getGoalsUseCase.execute(userId)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar uma meta específica' })
  @ApiParam({ name: 'id', description: 'ID da meta' })
  @ApiResponse({ status: 200, description: 'Meta encontrada' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async getById(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ) {
    return this.findGoalUseCase.execute(id, userId)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar meta' })
  @ApiParam({ name: 'id', description: 'ID da meta' })
  @ApiBody({ type: UpdateGoalDto })
  @ApiResponse({ status: 200, description: 'Meta atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async update(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() data: UpdateGoalDto
  ) {
    return this.updateGoalUseCase.execute(id, userId, data)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Excluir meta' })
  @ApiParam({ name: 'id', description: 'ID da meta' })
  @ApiResponse({ status: 200, description: 'Meta excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async delete(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ) {
    return this.deleteGoalUseCase.execute(id, userId)
  }
}
