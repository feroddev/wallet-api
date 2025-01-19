import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetInvoicesDto } from '../../../../credit-card/infra/http/dto/get-invoice.dto'
import { GetInvoicesUseCase } from '../../../../credit-card/use-case/get-invoices.use-case'
import { PaidSplitOrRecurrencyUseCase } from '../../../use-case/paid-split-or-recurrency.use-case'
import { PayCreditCardUseCase } from '../../../use-case/pay-credit-card.use-case'
import { PaySplitOrRecurrenceDto } from '../dto/pay-split-or-recurrence.dto'

@Auth()
@Controller('/split-or-recurrence')
export class SplitOrRecurrenceController {
  constructor(
    private readonly paidSplitOrRecurrencyUseCase: PaidSplitOrRecurrencyUseCase,
    private readonly payCreditCardUseCase: PayCreditCardUseCase,
    private readonly getInvoicesUseCase: GetInvoicesUseCase
  ) {}

  @Patch('/:id/pay')
  async pay(
    @Param('id') id: string,
    @Body() { paidAt }: PaySplitOrRecurrenceDto
  ) {
    return this.paidSplitOrRecurrencyUseCase.execute(id, paidAt)
  }

  @Patch('/credit-card/:creditCardId/pay')
  async payCreditCard(
    @Param('creditCardId') creditcardId,
    @Jwt() { userId }: JwtPayload,
    @Body() { paidAt }: PaySplitOrRecurrenceDto
  ) {
    return this.payCreditCardUseCase.execute(creditcardId, userId, paidAt)
  }

  @Get('/:creditCardId/invoices')
  async getInvoices(
    @Jwt() { userId }: JwtPayload,
    @Param('creditCardId') creditCardId: string,
    @Query() query: GetInvoicesDto
  ) {
    return this.getInvoicesUseCase.execute(userId, creditCardId, query)
  }
}
