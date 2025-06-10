import { Controller, Get } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetDashboardUseCase } from '../../../use-case/get-dashboard.use-case'

@Auth()
@Controller('dashboard')
export class DashboardController {
  constructor(private getDashboardUseCase: GetDashboardUseCase) {}

  @Get()
  async getDashboard(@Jwt() { userId }: JwtPayload) {
    const dashboard = await this.getDashboardUseCase.execute({
      userId
    })

    return dashboard
  }
}
