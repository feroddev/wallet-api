import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
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
  async create(
    @Body() body: CreateGoalDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { name, description, targetValue, savedValue, deadline } = body

    const goal = await this.createGoalUseCase.execute({
      userId,
      name,
      description,
      targetValue,
      savedValue,
      deadline
    })

    return {
      goal
    }
  }

  @Get()
  async getGoals(@Jwt() { userId }: JwtPayload) {
    const goals = await this.getGoalsUseCase.execute({
      userId
    })

    return {
      goals
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateGoalDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { name, description, targetValue, deadline } = body

    const goal = await this.updateGoalUseCase.execute({
      id,
      userId,
      name,
      description,
      targetValue,
      deadline
    })

    return {
      goal
    }
  }

  @Patch(':id/progress')
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

    return {
      goal
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Jwt() { userId }: JwtPayload
  ) {
    await this.deleteGoalUseCase.execute({
      id,
      userId
    })

    return {
      message: 'Meta removida com sucesso'
    }
  }
}
