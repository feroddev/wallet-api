import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetPlansUseCase } from '../../../use-case/get-plans.use-case'
import { UpdateUserPlanUseCase } from '../../../use-case/update-user-plan.use-case'
import { GetPlansDto } from '../dto/get-plans.dto'
import { UpdateUserPlanDto } from '../dto/update-user-plan.dto'

@Controller('plans')
export class SubscriptionPlansController {
  constructor(
    private getPlansUseCase: GetPlansUseCase,
    private updateUserPlanUseCase: UpdateUserPlanUseCase
  ) {}

  @Get()
  async getPlans(@Query() query: GetPlansDto) {
    const { isActive } = query

    const plans = await this.getPlansUseCase.execute({
      isActive
    })

    return {
      plans
    }
  }

  @Auth()
  @Patch(':id')
  async updateUserPlan(
    @Param('id') id: string,
    @Body() body: UpdateUserPlanDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { planId } = body

    await this.updateUserPlanUseCase.execute({
      userId,
      planId
    })

    return {
      message: 'Plano atualizado com sucesso'
    }
  }
}
