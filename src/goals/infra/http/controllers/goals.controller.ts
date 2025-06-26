import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateGoalUseCase } from '../../../use-case/create-goal.use-case'
import { DeleteGoalUseCase } from '../../../use-case/delete-goal.use-case'
import { GetGoalsUseCase } from '../../../use-case/get-goals.use-case'
import { UpdateGoalUseCase } from '../../../use-case/update-goal.use-case'
import { UpdateProgressUseCase } from '../../../use-case/update-progress.use-case'
import { CreateGoalDto } from '../dto/create-goal.dto'
import { UpdateGoalDto } from '../dto/update-goal.dto'
import { UpdateProgressDto } from '../dto/update-progress.dto'

@Auth()
@ApiTags('Metas')
@Controller('goals')
export class GoalsController {
  constructor(
    private createGoalUseCase: CreateGoalUseCase,
    private getGoalsUseCase: GetGoalsUseCase,
    private updateGoalUseCase: UpdateGoalUseCase,
    private updateProgressUseCase: UpdateProgressUseCase,
    private deleteGoalUseCase: DeleteGoalUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma meta financeira' })
  @ApiBody({ type: CreateGoalDto })
  @ApiResponse({ status: 201, description: 'Meta criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() body: CreateGoalDto, @Jwt() { userId }: JwtPayload) {
    const goal = await this.createGoalUseCase.execute({
      ...body,
      userId
    })

    return goal
  }

  @Get()
  @ApiOperation({ summary: 'Listar metas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de metas' })
  async getGoals(@Jwt() { userId }: JwtPayload) {
    const goals = await this.getGoalsUseCase.execute({
      userId
    })

    return goals
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar meta' })
  @ApiParam({ name: 'id', description: 'ID da meta' })
  @ApiBody({ type: UpdateGoalDto })
  @ApiResponse({ status: 200, description: 'Meta atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateGoalDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const goal = await this.updateGoalUseCase.execute({
      id,
      userId,
      ...body
    })

    return goal
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Atualizar progresso da meta' })
  @ApiParam({ name: 'id', description: 'ID da meta' })
  @ApiBody({ type: UpdateProgressDto })
  @ApiResponse({ status: 200, description: 'Progresso atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async updateProgress(
    @Param('id') id: string,
    @Body() body: UpdateProgressDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { amount } = body

    const goal = await this.updateProgressUseCase.execute({
      id,
      userId,
      amount
    })

    return goal
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir meta' })
  @ApiParam({ name: 'id', description: 'ID da meta' })
  @ApiResponse({ status: 200, description: 'Meta excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async delete(@Param('id') id: string, @Jwt() { userId }: JwtPayload) {
    await this.deleteGoalUseCase.execute({
      id,
      userId
    })

    return {
      message: 'Meta removida com sucesso'
    }
  }
}
