import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetInvoicesDto } from '../../../../credit-card/infra/http/dto/get-invoice.dto'
import { GetBillsUseCase } from '../../../use-case/get-bills.use-case'
import { GetInvoicesUseCase } from '../../../use-case/get-invoices.use-case'
import { PayCreditCardUseCase } from '../../../use-case/pay-credit-card.use-case'
import { PayIncomeDto } from '../dto/pay-income.dto'

@Auth()
@Controller('/credit-card-expense')
export class CreditCardExpenseController {
  constructor(
    private readonly payCreditCardUseCase: PayCreditCardUseCase,
    private readonly getInvoicesUseCase: GetInvoicesUseCase,
    private readonly getBillsUseCase: GetBillsUseCase
  ) {}

  @Patch(':creditCardId/pay')
  async payCreditCard(
    @Param('creditCardId') creditCardId,
    @Jwt() { userId }: JwtPayload,
    @Body() { paidAt, dueDate }: PayIncomeDto
  ) {
    return this.payCreditCardUseCase.execute({
      creditCardId,
      userId,
      paidAt,
      dueDate
    })
  }

  @Get(':creditCardId')
  async getInvoices(
    @Jwt() { userId }: JwtPayload,
    @Param('creditCardId') creditCardId: string,
    @Query() query: GetInvoicesDto
  ) {
    return this.getInvoicesUseCase.execute(userId, creditCardId, query)
  }
}
