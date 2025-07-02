import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetDashboardUseCase } from '../../../use-case/get-dashboard.use-case'

@Auth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private getDashboardUseCase: GetDashboardUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obter dados do dashboard' })
  @ApiQuery({
    name: 'month',
    required: false,
    type: Number,
    description: 'Mês (1-12)'
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Ano'
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do dashboard obtidos com sucesso'
  })
  async getDashboard(
    @Jwt() { userId }: JwtPayload,
    @Query('month') month?: string,
    @Query('year') year?: string
  ) {
    const dashboard = await this.getDashboardUseCase.execute({
      userId,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined
    })

    return dashboard
  }
}
