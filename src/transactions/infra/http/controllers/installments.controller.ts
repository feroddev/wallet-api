import { Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetInstallmentsUseCase } from '../../../../transactions/use-case/get-installments.use-case'
import { PayInstallmentUseCase } from '../../../use-case/pay-installment.use-case'
import { GetInstallmentsDto } from '../dto/get-installments.dto'

@Auth()
@Controller('/installments')
export class InstallmentsController {
  constructor(
    private readonly getInstallmentsUseCase: GetInstallmentsUseCase,
    private readonly payInstallmentUseCase: PayInstallmentUseCase
  ) {}

  @Get()
  async getInstallments(
    @Jwt() { userId }: JwtPayload,
    @Query() query: GetInstallmentsDto
  ) {
    return this.getInstallmentsUseCase.execute(userId, query)
  }

  @Patch('/:installmentId/pay')
  async payInstallment(
    @Jwt() { userId }: JwtPayload,
    @Param('installmentId') installmentId: string
  ) {
    return this.payInstallmentUseCase.execute(userId, installmentId)
  }
}
