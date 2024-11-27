import { Controller, Get, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetInstallmentsUseCase } from '../../../../transactions/use-case/get-installments.use-case'
import { GetInstallmentsDto } from '../dto/get-installments.dto'

@Auth()
@Controller('/installments')
export class InstallmentsController {
  constructor(
    private readonly getInstallmentsUseCase: GetInstallmentsUseCase
  ) {}

  @Get()
  async getInstallments(
    @Jwt() { userId }: JwtPayload,
    @Query() query: GetInstallmentsDto
  ) {
    return this.getInstallmentsUseCase.execute(userId, query)
  }
}
