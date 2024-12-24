import { Body, Controller, Param, Patch } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { PaidSplitOrRecurrencyUseCase } from '../../../use-case/paid-split-or-recurrency.use-case'
import { PaySplitOrRecurrenceDto } from '../dto/pay-split-or-recurrence.dto'

@Auth()
@Controller('/split-or-recurrence')
export class SplitOrRecurrenceController {
  constructor(
    private readonly paidSplitOrRecurrencyUseCase: PaidSplitOrRecurrencyUseCase
  ) {}

  @Patch('/:id/pay')
  async pay(
    @Param('id') id: string,
    @Jwt() { userId }: JwtPayload,
    @Body() { paidAt }: PaySplitOrRecurrenceDto
  ) {
    return this.paidSplitOrRecurrencyUseCase.execute(id, userId, paidAt)
  }
}
