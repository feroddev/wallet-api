import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetBillsDto } from '../../../../credit-card/infra/http/dto/get-bills.dto'
import { GetBillsUseCase } from '../../../use-case/get-bills.use-case'
import { PaidPendingPaymentUseCase } from '../../../use-case/paid-pending-payment.use-case'

@Auth()
@Controller('/pending-payment')
export class PendingPaymentController {
  constructor(
    private readonly paidPendingPaymentUseCase: PaidPendingPaymentUseCase,
    private readonly getBillsUseCase: GetBillsUseCase
  ) {}

  @Get()
  async getBills(@Jwt() { userId }: JwtPayload, @Query() query: GetBillsDto) {
    return this.getBillsUseCase.execute(userId, query)
  }

  @Patch('/:id/pay')
  async pay(@Param('id') id: string, @Body() { paidAt }: { paidAt: Date }) {
    return this.paidPendingPaymentUseCase.execute(id, paidAt)
  }
}
